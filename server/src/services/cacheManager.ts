import { CacheService } from "./cacheService";

export class CacheManager {
  private static instance: CacheManager;
  private caches: Map<string, CacheService> = new Map();

  private constructor() {}

  public static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  public getCache(name: string, ttl?: number): CacheService {
    if (!this.caches.has(name)) {
      this.caches.set(name, new CacheService(ttl, name));
    }
    return this.caches.get(name)!;
  }

  public createCache(name: string, ttl?: number): CacheService {
    const cache = new CacheService(ttl, name);
    this.caches.set(name, cache);
    return cache;
  }

  public getAllCaches(): CacheService[] {
    return Array.from(this.caches.values());
  }

  public getCacheNames(): string[] {
    return Array.from(this.caches.keys());
  }

  public scheduleOptimizationForAll(intervalMinutes: number = 30): void {
    this.getAllCaches().forEach((cache) => {
      cache.scheduleOptimization(intervalMinutes);
    });
  }

  public stopOptimizationForAll(): void {
    this.getAllCaches().forEach((cache) => {
      cache.stopOptimization();
    });
  }
  public flushAll(): void {
    this.getAllCaches().forEach((cache) => {
      cache.flush();
    });
  }

  public getAllCacheStatus(): Array<{ name: string; status: any }> {
    return this.getAllCaches().map((cache) => ({
      name: cache.getCacheStatus().name,
      status: cache.getCacheStatus(),
    }));
  }
}
