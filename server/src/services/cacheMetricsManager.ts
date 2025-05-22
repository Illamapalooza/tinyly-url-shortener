import { CacheService } from "./cacheService";

type CacheMetrics = {
  hits: number;
  misses: number;
  hitRate: number;
  size: number;
  lastCleanup: Date | null;
};

export class CacheMetricsManager {
  private metrics: CacheMetrics = {
    hits: 0,
    misses: 0,
    hitRate: 0,
    size: 0,
    lastCleanup: null,
  };

  private cacheInstance?: CacheService;
  private optimizationTimer?: NodeJS.Timeout;

  constructor(cacheInstance?: CacheService) {
    this.cacheInstance = cacheInstance;
  }

  recordHit(): void {
    this.metrics.hits++;
    this.updateHitRate();
  }

  recordMiss(): void {
    this.metrics.misses++;
    this.updateHitRate();
  }

  updateSize(size: number): void {
    this.metrics.size = size;
  }

  recordCleanup(): void {
    this.metrics.lastCleanup = new Date();
  }

  private updateHitRate(): void {
    const total = this.metrics.hits + this.metrics.misses;
    this.metrics.hitRate = total > 0 ? (this.metrics.hits / total) * 100 : 0;
  }

  getMetrics(): CacheMetrics {
    return { ...this.metrics };
  }

  optimizeCache(): void {
    if (this.metrics.hitRate < 30 && this.metrics.size > 1000) {
      this.cacheInstance?.flush();
      this.recordCleanup();
      console.log("Cache optimized due to low hit rate");
    }
  }

  scheduleOptimization(intervalMinutes: number = 30): NodeJS.Timeout {
    this.stopOptimization();

    this.optimizationTimer = setInterval(() => {
      this.optimizeCache();
    }, intervalMinutes * 60 * 1000);

    return this.optimizationTimer;
  }

  stopOptimization(): void {
    if (this.optimizationTimer) {
      clearInterval(this.optimizationTimer);
    }
  }
}
