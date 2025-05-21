import { globalCache } from "../rest-api";

type CacheMetrics = {
  hits: number;
  misses: number;
  hitRate: number;
  size: number;
  lastCleanup: Date | null;
};

export class CacheMetricsManager {
  private static metrics: CacheMetrics = {
    hits: 0,
    misses: 0,
    hitRate: 0,
    size: 0,
    lastCleanup: null,
  };

  static recordHit(): void {
    this.metrics.hits++;
    this.updateHitRate();
  }

  static recordMiss(): void {
    this.metrics.misses++;
    this.updateHitRate();
  }

  static updateSize(size: number): void {
    this.metrics.size = size;
  }

  static recordCleanup(): void {
    this.metrics.lastCleanup = new Date();
  }

  private static updateHitRate(): void {
    const total = this.metrics.hits + this.metrics.misses;
    this.metrics.hitRate = total > 0 ? (this.metrics.hits / total) * 100 : 0;
  }

  static getMetrics(): CacheMetrics {
    return { ...this.metrics };
  }

  static optimizeCache(): void {
    if (this.metrics.hitRate < 30 && this.metrics.size > 1000) {
      globalCache.flush();
      this.recordCleanup();
      console.log("Cache optimized due to low hit rate");
    }
  }

  static scheduleOptimization(intervalMinutes: number = 30): NodeJS.Timeout {
    return setInterval(() => {
      this.optimizeCache();
    }, intervalMinutes * 60 * 1000);
  }
}
