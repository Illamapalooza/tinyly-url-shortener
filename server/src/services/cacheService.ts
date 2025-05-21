import NodeCache from "node-cache";

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
    return this.cache.get<T>(key);
  }

  set<T>(key: string, value: T, ttl: number = 3600): boolean {
    return this.cache.set(key, value, ttl);
  }

  delete(key: string): number {
    return this.cache.del(key);
  }

  flush(): void {
    this.cache.flushAll();
  }

  // Method to adjust TTL based on access frequency
  updateTTL(key: string, accessCount: number): boolean {
    // Increase TTL for frequently accessed URLs (up to 24 hours)
    const baseTTL = 3600; // 1 hour
    const maxTTL = 86400; // 24 hours

    // Calculate dynamic TTL based on access count
    const dynamicTTL = Math.min(baseTTL * Math.log(accessCount + 1), maxTTL);

    // Get the current value
    const value = this.cache.get(key);
    if (value === undefined) return false;

    // Reset with new TTL
    return this.cache.set(key, value, dynamicTTL);
  }

  // Get all recent URLs from cache
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
}
