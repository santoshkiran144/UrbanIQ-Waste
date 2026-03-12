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
const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const normalizeOrigin = (value) => value?.replace(/\/$/, "");

const hasMatchingHostnameSuffix = (origin, suffix) => {
  try {
    const { hostname, protocol } = new URL(origin);
    return protocol === "https:" && hostname.endsWith(suffix);
  } catch (_error) {
    return false;
  }
};

const isOriginAllowed = (origin) => {
  if (!origin) {
    return true;
  }

  if (!allowedOrigins.length) {
    return true;
  }

  const normalizedOrigin = normalizeOrigin(origin);
  const normalizedAllowedOrigins = allowedOrigins.map(normalizeOrigin);

  if (normalizedAllowedOrigins.includes(normalizedOrigin)) {
    return true;
  }

  return normalizedAllowedOrigins.some((allowedOrigin) => {
    if (allowedOrigin?.includes("vercel.app")) {
      return hasMatchingHostnameSuffix(normalizedOrigin, ".vercel.app");
    }

    if (allowedOrigin?.includes("localhost")) {
      return /^https?:\/\/localhost(?::\d+)?$/i.test(normalizedOrigin);
    }

    return false;
  });
};

app.use(
  cors({
    origin(origin, callback) {
      if (isOriginAllowed(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    }
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
