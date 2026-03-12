import Household from "../models/Household.js";
import Violation from "../models/Violation.js";

export const buildHouseholdId = ({ buildingName, unitNumber }) => {
  const buildingPrefix = buildingName.replace(/[^a-zA-Z0-9]/g, "").slice(0, 4).toUpperCase() || "BLDG";
  const unitPrefix = unitNumber.replace(/[^a-zA-Z0-9]/g, "").toUpperCase() || "UNIT";
  return `${buildingPrefix}-${unitPrefix}`;
};

export const computeComplianceScore = (violationCount) => Math.max(0, 100 - violationCount * 10);

export const syncHouseholdCompliance = async (householdIdOrObjectId) => {
  const household = await Household.findOne({
    $or: [{ _id: householdIdOrObjectId }, { householdId: householdIdOrObjectId }]
  });

  if (!household) {
    return null;
  }

  const verifiedViolations = await Violation.find({
    household: household._id,
    status: "verified"
  }).select("pointsDeducted");

  const violationCount = verifiedViolations.length;
  const totalPointsDeducted = verifiedViolations.reduce(
    (sum, violation) => sum + (violation.pointsDeducted || 10),
    0
  );

  household.violationCount = violationCount;
  household.complianceScore = Math.max(0, 100 - totalPointsDeducted);
  await household.save();

  return household;
};
