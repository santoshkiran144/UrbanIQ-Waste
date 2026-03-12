import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import path from "path";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";
import residentRoutes from "./routes/residentRoutes.js";
import violationRoutes from "./routes/violationRoutes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*"
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use("/uploads", express.static(path.resolve("uploads")));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/violations", violationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/resident", residentRoutes);

app.use((err, _req, res, _next) => {
  return res.status(500).json({ message: err.message || "Server error" });
});

export default app;
