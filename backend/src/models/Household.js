import mongoose from "mongoose";

const householdSchema = new mongoose.Schema(
  {
    householdId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    buildingName: {
      type: String,
      required: true,
      trim: true
    },
    unitNumber: {
      type: String,
      required: true,
      trim: true
    },
    resident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    complianceScore: {
      type: Number,
      default: 100
    },
    violationCount: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

export default mongoose.model("Household", householdSchema);
