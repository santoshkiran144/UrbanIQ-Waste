import Household from "../models/Household.js";
import Violation from "../models/Violation.js";
import { syncHouseholdCompliance } from "../utils/household.js";

export const createViolation = async (req, res) => {
  try {
    const { householdId, location, notes } = req.body;

    if (!householdId || !location || !req.file) {
      return res.status(400).json({ message: "Household ID, location, and image are required" });
    }

    const household = await Household.findOne({ householdId: householdId.toUpperCase() });

    if (!household) {
      return res.status(404).json({ message: "Household not found" });
    }

    const violation = await Violation.create({
      household: household._id,
      householdId: household.householdId,
      collector: req.user._id,
      imageUrl: `/uploads/${req.file.filename}`,
      location,
      notes,
      status: "verified",
      pointsDeducted: 10
    });

    const updatedHousehold = await syncHouseholdCompliance(household._id);

    return res.status(201).json({ violation, household: updatedHousehold });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to create violation" });
  }
};

export const getCollectorViolations = async (req, res) => {
  const violations = await Violation.find({ collector: req.user._id })
    .sort({ createdAt: -1 })
    .limit(20)
    .populate("household", "buildingName unitNumber complianceScore");

  return res.json({ violations });
};

export const getCollectorHouseholds = async (req, res) => {
  const { search = "" } = req.query;

  const households = await Household.find(
    search
      ? {
          $or: [
            { householdId: { $regex: search, $options: "i" } },
            { buildingName: { $regex: search, $options: "i" } },
            { unitNumber: { $regex: search, $options: "i" } }
          ]
        }
      : {}
  )
    .sort({ buildingName: 1, unitNumber: 1 })
    .limit(20)
    .select("householdId buildingName unitNumber complianceScore violationCount");

  return res.json({ households });
};
