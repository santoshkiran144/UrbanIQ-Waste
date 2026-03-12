import Household from "../models/Household.js";
import Violation from "../models/Violation.js";

export const getPublicOverview = async (_req, res) => {
  try {
    const totalHouseholds = await Household.countDocuments();
    const compliantHouseholds = await Household.countDocuments({ complianceScore: { $gte: 80 } });
    const totalViolations = await Violation.countDocuments({ status: { $ne: "dismissed" } });

    return res.json({
      compliancePercentage: totalHouseholds
        ? Number(((compliantHouseholds / totalHouseholds) * 100).toFixed(1))
        : 0,
      totalViolations,
      totalHouseholds
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to load public overview" });
  }
};
