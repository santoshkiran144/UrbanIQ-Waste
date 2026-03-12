import Household from "../models/Household.js";
import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import { buildHouseholdId } from "../utils/household.js";

const serializeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  buildingName: user.buildingName,
  unitNumber: user.unitNumber || ""
});

export const signup = async (req, res) => {
  try {
    const { role, name, email, password, buildingName, unitNumber, phone } = req.body;

    if (!role || !name || !email || !password || !buildingName) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    if (role === "resident" && !unitNumber) {
      return res.status(400).json({ message: "Unit number is required for residents" });
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

    if (role === "resident") {
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

    const token = generateToken(user);
    return res.status(201).json({ token, user: serializeUser(user) });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Signup failed" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);
    return res.json({ token, user: serializeUser(user) });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Login failed" });
  }
};

export const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  return res.json({ user: serializeUser(user) });
};
