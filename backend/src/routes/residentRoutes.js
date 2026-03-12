import express from "express";
import { getResidentDashboard } from "../controllers/residentController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dashboard", protect, authorize("resident"), getResidentDashboard);

export default router;
