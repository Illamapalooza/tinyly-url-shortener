import NodeCache from "node-cache";
import { CacheMetricsManager } from "./cacheMetricsManager";

export class CacheService {
  private cache: NodeCache;

  constructor(ttlSeconds: number = 3600) {
    this.cache = new NodeCache({
      stdTTL: ttlSeconds,
      checkperiod: ttlSeconds * 0.2,
      useClones: false,
    });
  }

  get<T>(key: string): T | undefined {
    const value = this.cache.get<T>(key);
    if (value === undefined) {
      CacheMetricsManager.recordMiss();
    } else {
      CacheMetricsManager.recordHit();
    }
    CacheMetricsManager.updateSize(this.cache.keys().length);
    return value;
  }

  set<T>(key: string, value: T, ttl: number = 3600): boolean {
    const result = this.cache.set(key, value, ttl);
    CacheMetricsManager.updateSize(this.cache.keys().length);
    return result;
  }

  delete(key: string): number {
    const result = this.cache.del(key);
    CacheMetricsManager.updateSize(this.cache.keys().length);
    return result;
  }

  flush(): void {
    this.cache.flushAll();
    CacheMetricsManager.updateSize(0);
    CacheMetricsManager.recordCleanup();
  }

  updateTTL(key: string, accessCount: number): boolean {
    const baseTTL = 3600;
    const maxTTL = 86400;

    // Calculate dynamic TTL based on access count
    const dynamicTTL = Math.min(baseTTL * Math.log(accessCount + 1), maxTTL);

    const value = this.cache.get(key);
    if (value === undefined) return false;

    return this.cache.set(key, value, dynamicTTL);
  }

  getAllRecentUrls<T>(): T[] {
    const keys = this.cache.keys();
    const urlKeys = keys.filter((key) => key.startsWith("url:"));

    return urlKeys
      .map((key) => {
        const value = this.cache.get<T>(key);
        return value as T;
      })
      .filter(Boolean);
  }

  // Add a health check method to verify cache status
  getCacheStatus() {
    return {
      keys: this.cache.keys().length,
      stats: this.cache.getStats(),
      metrics: CacheMetricsManager.getMetrics(),
    };
  }
}
