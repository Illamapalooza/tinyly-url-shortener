import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import urlRoutes from "./routes/urlRoutes";
import { CacheManager } from "./services/cacheManager";
import { specs } from "./swagger";

dotenv.config();

// Initialize the cache manager and get the global cache
const cacheManager = CacheManager.getInstance();
export const globalCache = cacheManager.getCache(
  "global",
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

// Caching layer
const optimizationInterval =
  Number(process.env.CACHE_OPTIMIZATION_INTERVAL) || 30;
cacheManager.scheduleOptimizationForAll(optimizationInterval);

process.on("SIGTERM", () => {
  cacheManager.stopOptimizationForAll();
  console.log("Cache optimization stopped");
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`server has started on port ${PORT}`);
  console.log(
    `API Documentation available at http://localhost:${PORT}/api-docs`
  );
});
