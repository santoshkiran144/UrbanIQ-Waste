import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDb } from "../config/db.js";
import Household from "../models/Household.js";
import User from "../models/User.js";
import Violation from "../models/Violation.js";
import { buildHouseholdId, computeComplianceScore } from "./household.js";

dotenv.config();

const demoUsers = [
  { role: "admin", name: "Anita Sharma", email: "admin@urbaniq.test", password: "password123", buildingName: "Green Heights" },
  { role: "collector", name: "Ravi Kumar", email: "collector1@urbaniq.test", password: "password123", buildingName: "Green Heights" },
  { role: "collector", name: "Meena Das", email: "collector2@urbaniq.test", password: "password123", buildingName: "Skyline Residency" },
  { role: "resident", name: "Asha Nair", email: "asha@urbaniq.test", password: "password123", buildingName: "Green Heights", unitNumber: "A-101" },
  { role: "resident", name: "Rohan Singh", email: "rohan@urbaniq.test", password: "password123", buildingName: "Green Heights", unitNumber: "A-102" },
  { role: "resident", name: "Nisha Iyer", email: "nisha@urbaniq.test", password: "password123", buildingName: "Green Heights", unitNumber: "B-201" },
  { role: "resident", name: "Karan Patel", email: "karan@urbaniq.test", password: "password123", buildingName: "Skyline Residency", unitNumber: "C-301" },
  { role: "resident", name: "Fatima Ali", email: "fatima@urbaniq.test", password: "password123", buildingName: "Skyline Residency", unitNumber: "C-302" },
  { role: "resident", name: "Sanjay Rao", email: "sanjay@urbaniq.test", password: "password123", buildingName: "Lakeview Towers", unitNumber: "D-401" },
  { role: "resident", name: "Priya Menon", email: "priya@urbaniq.test", password: "password123", buildingName: "Lakeview Towers", unitNumber: "D-402" }
];

const createDemoData = async () => {
  await connectDb();

  await Promise.all([User.deleteMany({}), Household.deleteMany({}), Violation.deleteMany({})]);

  const createdUsers = [];
  for (const userData of demoUsers) {
    const user = await User.create(userData);
    createdUsers.push(user);
  }

  const residents = createdUsers.filter((user) => user.role === "resident");
  const collectors = createdUsers.filter((user) => user.role === "collector");
  const sampleLocations = ["North Gate", "Block A Lobby", "Service Lane", "Tower Lift Bay", "Community Dock"];

  for (let index = 0; index < residents.length; index += 1) {
    const resident = residents[index];
    const householdId = buildHouseholdId({
      buildingName: resident.buildingName,
      unitNumber: resident.unitNumber
    });

    const household = await Household.create({
      householdId,
      buildingName: resident.buildingName,
      unitNumber: resident.unitNumber,
      resident: resident._id
    });

    const violationCount = index % 3;
    for (let count = 0; count < violationCount; count += 1) {
      await Violation.create({
        household: household._id,
        householdId: household.householdId,
        collector: collectors[count % collectors.length]._id,
        imageUrl: "/uploads/demo-evidence.svg",
        date: new Date(2026, Math.max(0, index - count), 5 + count),
        location: sampleLocations[(index + count) % sampleLocations.length],
        notes: "Seeded mixed-waste observation",
        status: "verified",
        pointsDeducted: 10
      });
    }

    household.violationCount = violationCount;
    household.complianceScore = computeComplianceScore(violationCount);
    await household.save();
  }

  console.log("Demo data created");
  await mongoose.connection.close();
};

createDemoData().catch(async (error) => {
  console.error(error);
  await mongoose.connection.close();
  process.exit(1);
});
