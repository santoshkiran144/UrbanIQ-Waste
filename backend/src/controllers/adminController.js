import Household from "../models/Household.js";
import User from "../models/User.js";
import Violation from "../models/Violation.js";
import { buildHouseholdId, syncHouseholdCompliance } from "../utils/household.js";

const serializeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  buildingName: user.buildingName,
  unitNumber: user.unitNumber || "",
  phone: user.phone || "",
  createdAt: user.createdAt
});

const getDashboardPayload = async () => {
  const totalHouseholds = await Household.countDocuments();
  const totalViolations = await Violation.countDocuments();
  const compliantHouseholds = await Household.countDocuments({ complianceScore: { $gte: 80 } });
  const repeatOffenders = await Household.find({ violationCount: { $gte: 2 } })
    .sort({ violationCount: -1, complianceScore: 1 })
    .limit(10)
    .lean();

  const buildingPerformance = await Household.aggregate([
    {
      $group: {
        _id: "$buildingName",
        avgScore: { $avg: "$complianceScore" },
        totalViolations: { $sum: "$violationCount" },
        totalHouseholds: { $sum: 1 }
      }
    },
    { $sort: { avgScore: -1 } }
  ]);

  const monthlyViolationTrends = await Violation.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$date" },
          month: { $month: "$date" }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
    {
      $project: {
        _id: 0,
        label: {
          $concat: [
            { $toString: "$_id.year" },
            "-",
            {
              $cond: [
                { $lt: ["$_id.month", 10] },
                { $concat: ["0", { $toString: "$_id.month" }] },
                { $toString: "$_id.month" }
              ]
            }
          ]
        },
        count: 1
      }
    }
  ]);

  return {
    summary: {
      totalHouseholds,
      totalViolations,
      compliancePercentage: totalHouseholds
        ? Number(((compliantHouseholds / totalHouseholds) * 100).toFixed(1))
        : 0
    },
    repeatOffenders,
    buildingPerformance,
    monthlyViolationTrends
  };
};

export const getDashboardAnalytics = async (_req, res) => {
  try {
    return res.json(await getDashboardPayload());
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to load analytics" });
  }
};

export const listUsers = async (_req, res) => {
  const users = await User.find().sort({ createdAt: -1 }).select("-password");
  const households = await Household.find({
    resident: { $in: users.filter((user) => user.role === "resident").map((user) => user._id) }
  }).select("resident householdId complianceScore violationCount");

  const householdByResidentId = new Map(
    households.map((household) => [
      household.resident?.toString(),
      {
        householdId: household.householdId,
        complianceScore: household.complianceScore,
        violationCount: household.violationCount
      }
    ])
  );

  return res.json({
    users: users.map((user) => ({
      ...serializeUser(user),
      household: householdByResidentId.get(user._id.toString()) || null
    }))
  });
};

export const createUser = async (req, res) => {
  try {
    const { role, name, email, password, buildingName, unitNumber, phone } = req.body;

    if (!role || !name || !email || !password || !buildingName) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const user = await User.create({
      role,
      name,
      email,
      password,
      buildingName,
      unitNumber,
      phone
    });

    if (role === "resident" && unitNumber) {
      const householdId = buildHouseholdId({ buildingName, unitNumber });
      await Household.findOneAndUpdate(
        { householdId },
        {
          householdId,
          buildingName,
          unitNumber,
          resident: user._id
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    return res.status(201).json({ user: serializeUser(user) });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to create user" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, buildingName, unitNumber, phone, password } = req.body;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const previousRole = user.role;
    user.name = name ?? user.name;
    user.email = email?.toLowerCase() ?? user.email;
    user.role = role ?? user.role;
    user.buildingName = buildingName ?? user.buildingName;
    user.unitNumber = unitNumber ?? user.unitNumber;
    user.phone = phone ?? user.phone;
    if (password) {
      user.password = password;
    }

    await user.save();

    if (user.role === "resident" && user.unitNumber) {
      const householdId = buildHouseholdId({
        buildingName: user.buildingName,
        unitNumber: user.unitNumber
      });

      await Household.findOneAndUpdate(
        { resident: user._id },
        {
          householdId,
          buildingName: user.buildingName,
          unitNumber: user.unitNumber,
          resident: user._id
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    } else if (previousRole === "resident" && user.role !== "resident") {
      const households = await Household.find({ resident: user._id }).select("_id");
      const householdIds = households.map((household) => household._id);
      await Violation.deleteMany({ household: { $in: householdIds } });
      await Household.deleteMany({ resident: user._id });
    }

    return res.json({ user: serializeUser(user) });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to update user" });
  }
};

export const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const households = await Household.find({ resident: user._id }).select("_id");
  const householdIds = households.map((household) => household._id);
  await Violation.deleteMany({ household: { $in: householdIds } });
  await Household.deleteMany({ resident: user._id });
  await Violation.deleteMany({ collector: user._id });
  await user.deleteOne();

  return res.json({ message: "User deleted" });
};

export const listHouseholds = async (_req, res) => {
  const households = await Household.find()
    .sort({ createdAt: -1 })
    .populate("resident", "name email");
  return res.json({ households });
};

export const createHousehold = async (req, res) => {
  try {
    const { buildingName, unitNumber, resident } = req.body;

    if (!buildingName || !unitNumber) {
      return res.status(400).json({ message: "Building name and unit number are required" });
    }

    const householdId = buildHouseholdId({ buildingName, unitNumber });
    const household = await Household.create({
      householdId,
      buildingName,
      unitNumber,
      resident: resident || undefined
    });

    return res.status(201).json({ household });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to create household" });
  }
};

export const updateHousehold = async (req, res) => {
  try {
    const household = await Household.findById(req.params.id);

    if (!household) {
      return res.status(404).json({ message: "Household not found" });
    }

    household.buildingName = req.body.buildingName ?? household.buildingName;
    household.unitNumber = req.body.unitNumber ?? household.unitNumber;
    household.resident = req.body.resident ?? household.resident;
    household.householdId = buildHouseholdId({
      buildingName: household.buildingName,
      unitNumber: household.unitNumber
    });

    await household.save();
    const syncedHousehold = await syncHouseholdCompliance(household._id);

    return res.json({ household: syncedHousehold });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to update household" });
  }
};

export const deleteHousehold = async (req, res) => {
  const household = await Household.findById(req.params.id);

  if (!household) {
    return res.status(404).json({ message: "Household not found" });
  }

  await Violation.deleteMany({ household: household._id });
  await household.deleteOne();

  return res.json({ message: "Household deleted" });
};

export const listViolations = async (_req, res) => {
  const violations = await Violation.find()
    .sort({ date: -1, createdAt: -1 })
    .populate("collector", "name email")
    .populate("household", "householdId buildingName unitNumber complianceScore");

  return res.json({ violations });
};

export const createViolation = async (req, res) => {
  try {
    const { householdId, collector, location, notes, status, pointsDeducted, imageUrl, date } = req.body;

    if (!householdId || !collector || !location) {
      return res.status(400).json({ message: "Household ID, collector, and location are required" });
    }

    const household = await Household.findOne({ householdId: householdId.toUpperCase() });
    if (!household) {
      return res.status(404).json({ message: "Household not found" });
    }

    const normalizedDate = date ? new Date(date) : new Date();

    const violation = await Violation.create({
      household: household._id,
      householdId: household.householdId,
      collector,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : imageUrl || "/uploads/demo-evidence.svg",
      location,
      notes,
      status: status || "verified",
      pointsDeducted: Number(pointsDeducted) || 10,
      date: normalizedDate
    });

    await syncHouseholdCompliance(household._id);
    return res.status(201).json({ violation });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to create violation" });
  }
};

export const updateViolation = async (req, res) => {
  try {
    const violation = await Violation.findById(req.params.id);

    if (!violation) {
      return res.status(404).json({ message: "Violation not found" });
    }

    const previousHouseholdId = violation.household;
    const nextHousehold =
      req.body.householdId && req.body.householdId !== violation.householdId
        ? await Household.findOne({ householdId: req.body.householdId.toUpperCase() })
        : null;

    if (req.body.householdId && !nextHousehold) {
      return res.status(404).json({ message: "New household not found" });
    }

    if (nextHousehold) {
      violation.household = nextHousehold._id;
      violation.householdId = nextHousehold.householdId;
    }

    violation.collector = req.body.collector ?? violation.collector;
    violation.location = req.body.location ?? violation.location;
    violation.notes = req.body.notes ?? violation.notes;
    violation.status = req.body.status ?? violation.status;
    violation.pointsDeducted = req.body.pointsDeducted ? Number(req.body.pointsDeducted) : violation.pointsDeducted;
    violation.imageUrl = req.file ? `/uploads/${req.file.filename}` : req.body.imageUrl ?? violation.imageUrl;
    if (req.body.date) {
      violation.date = new Date(req.body.date);
    }

    await violation.save();
    await syncHouseholdCompliance(previousHouseholdId);
    await syncHouseholdCompliance(violation.household);

    return res.json({ violation });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to update violation" });
  }
};

export const deleteViolation = async (req, res) => {
  const violation = await Violation.findById(req.params.id);

  if (!violation) {
    return res.status(404).json({ message: "Violation not found" });
  }

  const householdId = violation.household;
  await violation.deleteOne();
  await syncHouseholdCompliance(householdId);

  return res.json({ message: "Violation deleted" });
};
