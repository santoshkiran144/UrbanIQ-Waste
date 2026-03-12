import express from "express";
import {
  createHousehold,
  createUser,
  createViolation,
  deleteHousehold,
  deleteUser,
  deleteViolation,
  getDashboardAnalytics,
  listHouseholds,
  listUsers,
  listViolations,
  updateHousehold,
  updateUser,
  updateViolation
} from "../controllers/adminController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/dashboard", getDashboardAnalytics);

router.get("/users", listUsers);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

router.get("/households", listHouseholds);
router.post("/households", createHousehold);
router.put("/households/:id", updateHousehold);
router.delete("/households/:id", deleteHousehold);

router.get("/violations", listViolations);
router.post("/violations", upload.single("image"), createViolation);
router.put("/violations/:id", upload.single("image"), updateViolation);
router.delete("/violations/:id", deleteViolation);

export default router;
