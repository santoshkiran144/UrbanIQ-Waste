import Household from "../models/Household.js";
import Violation from "../models/Violation.js";
import { buildHouseholdId } from "../utils/household.js";

export const getResidentDashboard = async (req, res) => {
  try {
    const householdId = buildHouseholdId({
      buildingName: req.user.buildingName,
      unitNumber: req.user.unitNumber
    });

    const household = await Household.findOne({ householdId }).lean();

    if (!household) {
      return res.status(404).json({ message: "Resident household not found" });
    }

    const violations = await Violation.find({ household: household._id })
      .sort({ date: -1 })
      .limit(10)
      .populate("collector", "name");

    return res.json({ household, violations });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to load resident dashboard" });
  }
};
