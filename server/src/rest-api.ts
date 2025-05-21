import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import urlRoutes from "./routes/urlRoutes";
import { CacheService } from "./services/cacheService";
import { CacheMetricsManager } from "./services/cacheMetricsManager";

dotenv.config();

export const globalCache = new CacheService(
  Number(process.env.CACHE_TTL) || 3600
);

const app = express();

//middleware
app.use(cors());
app.use(express.json());

// URL Shortener routes
app.use("/", urlRoutes);

const optimizationInterval =
  Number(process.env.CACHE_OPTIMIZATION_INTERVAL) || 30;
const cacheOptimizationTimer =
  CacheMetricsManager.scheduleOptimization(optimizationInterval);

// Handle graceful shutdown
process.on("SIGTERM", () => {
  clearInterval(cacheOptimizationTimer);
  console.log("Cache optimization stopped");
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`server has started on port ${PORT}`);
});
