export const sampleHouseholds = [
  {
    householdId: "GREE-A101",
    buildingName: "Green Heights",
    unitNumber: "A-101",
    violationCount: 1,
    complianceScore: 90,
    imageUrl: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80",
    timestamp: "2026-03-10T08:20:00.000Z"
  },
  {
    householdId: "GREE-A102",
    buildingName: "Green Heights",
    unitNumber: "A-102",
    violationCount: 3,
    complianceScore: 70,
    imageUrl: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80",
    timestamp: "2026-03-08T09:00:00.000Z"
  },
  {
    householdId: "SKYL-C301",
    buildingName: "Skyline Residency",
    unitNumber: "C-301",
    violationCount: 2,
    complianceScore: 80,
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
    timestamp: "2026-03-01T07:10:00.000Z"
  }
];

export const sampleViolations = [
  {
    _id: "vio-1",
    householdId: "GREE-A101",
    location: "North Gate",
    status: "verified",
    pointsDeducted: 10,
    imageUrl: sampleHouseholds[0].imageUrl,
    date: "2026-03-10T08:20:00.000Z",
    notes: "Wet and dry waste found mixed in same bag.",
    collector: { _id: "collector-1", name: "Ravi Kumar" },
    household: sampleHouseholds[0]
  },
  {
    _id: "vio-2",
    householdId: "GREE-A102",
    location: "Tower A Lift Bay",
    status: "pending",
    pointsDeducted: 10,
    imageUrl: sampleHouseholds[1].imageUrl,
    date: "2026-03-08T09:00:00.000Z",
    notes: "Plastic packaging mixed with food waste.",
    collector: { _id: "collector-2", name: "Meena Das" },
    household: sampleHouseholds[1]
  }
];

export const sampleCollectorHouseholds = sampleHouseholds.map((household) => ({
  householdId: household.householdId,
  buildingName: household.buildingName,
  unitNumber: household.unitNumber,
  complianceScore: household.complianceScore,
  violationCount: household.violationCount
}));
