import { globalCache } from "../rest-api";

interface CacheMetrics {
  hits: number;
  misses: number;
  hitRate: number;
  size: number;
  lastCleanup: Date | null;
}

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

  // Perform cache optimization based on hit rate and memory usage
  static optimizeCache(): void {
    // If hit rate is low (below 30%), adjust cache settings
    if (this.metrics.hitRate < 30 && this.metrics.size > 1000) {
      // Clean up least used entries
      globalCache.flush();
      this.recordCleanup();
      console.log("Cache optimized due to low hit rate");
    }
  }

  // Schedule periodic cache optimization
  static scheduleOptimization(intervalMinutes: number = 30): NodeJS.Timeout {
    return setInterval(() => {
      this.optimizeCache();
    }, intervalMinutes * 60 * 1000);
  }
}
