import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import urlRoutes from "./routes/urlRoutes";
import { CacheService } from "./services/cacheService";
import { CacheMetricsManager } from "./services/cacheMetricsManager";
import { specs } from "./swagger";

dotenv.config();

export const globalCache = new CacheService(
  Number(process.env.CACHE_TTL) || 3600
);

const app = express();

//middleware
app.use(cors());
app.use(express.json());

// Swagger API documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

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
  console.log(
    `API Documentation available at http://localhost:${PORT}/api-docs`
  );
});
