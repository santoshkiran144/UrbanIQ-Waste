import mongoose from "mongoose";

const violationSchema = new mongoose.Schema(
  {
    household: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Household",
      required: true
    },
    householdId: {
      type: String,
      required: true,
      uppercase: true,
      trim: true
    },
    collector: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    imageUrl: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    location: {
      type: String,
      required: true,
      trim: true
    },
    notes: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ["pending", "verified", "dismissed"],
      default: "verified"
    },
    pointsDeducted: {
      type: Number,
      default: 10
    }
  },
  { timestamps: true }
);

export default mongoose.model("Violation", violationSchema);
