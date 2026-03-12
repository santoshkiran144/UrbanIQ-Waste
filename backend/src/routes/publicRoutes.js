import express from "express";
import { getPublicOverview } from "../controllers/publicController.js";

const router = express.Router();

router.get("/overview", getPublicOverview);

export default router;
