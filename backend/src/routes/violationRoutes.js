import express from "express";
import { createViolation, getCollectorHouseholds, getCollectorViolations } from "../controllers/violationController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.use(protect);
router.post("/", authorize("collector"), upload.single("image"), createViolation);
router.get("/households", authorize("collector"), getCollectorHouseholds);
router.get("/my-reports", authorize("collector"), getCollectorViolations);

export default router;
