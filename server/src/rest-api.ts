import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import urlRoutes from "./routes/urlRoutes";
import { CacheManager } from "./services/cacheManager";
import { specs } from "./swagger";
import logger from "./utils/logger";
import { httpLogger } from "./utils/httpLogger";
import { errorHandler } from "./utils/errorHandler";

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
app.use(httpLogger);

// Swagger API documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// URL Shortener routes
app.use("/", urlRoutes);

app.use(errorHandler);

// Caching layer
const optimizationInterval =
  Number(process.env.CACHE_OPTIMIZATION_INTERVAL) || 30;
cacheManager.scheduleOptimizationForAll(optimizationInterval);

// Handle unexpected errors
process.on("uncaughtException", (error) => {
  logger.error(`Uncaught Exception: ${error.message}`, error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
  process.exit(1);
});

process.on("SIGTERM", () => {
  cacheManager.stopOptimizationForAll();
  logger.info("Cache optimization stopped");
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  logger.info(`Server has started on port ${PORT}`);
  logger.info(
    `API Documentation available at http://localhost:${PORT}/api-docs`
  );
});
