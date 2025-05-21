import NodeCache from "node-cache";

class TestCacheMetricsManager {
  static metrics = {
    hits: 0,
    misses: 0,
    hitRate: 0,
    size: 0,
    lastCleanup: null as Date | null,
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

  static getMetrics() {
    return { ...this.metrics };
  }
}

class TestCacheService {
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
      TestCacheMetricsManager.recordMiss();
    } else {
      TestCacheMetricsManager.recordHit();
    }
    TestCacheMetricsManager.updateSize(this.cache.keys().length);
    return value;
  }

  set<T>(key: string, value: T, ttl: number = 3600): boolean {
    const result = this.cache.set(key, value, ttl);
    TestCacheMetricsManager.updateSize(this.cache.keys().length);
    return result;
  }

  delete(key: string): number {
    const result = this.cache.del(key);
    TestCacheMetricsManager.updateSize(this.cache.keys().length);
    return result;
  }

  flush(): void {
    this.cache.flushAll();
    TestCacheMetricsManager.updateSize(0);
    TestCacheMetricsManager.recordCleanup();
  }

  getCacheStatus() {
    return {
      keys: this.cache.keys().length,
      stats: this.cache.getStats(),
      metrics: TestCacheMetricsManager.getMetrics(),
    };
  }
}

function testCacheOperation() {
  console.log("Testing cache functionality...");

  const cache = new TestCacheService(600); // 10 minute TTL

  console.log("Initial cache status:", cache.getCacheStatus());

  cache.set("test1", { value: "test value 1" });
  cache.set("test2", { value: "test value 2" });

  const value1 = cache.get("test1");
  console.log("Retrieved test1:", value1);

  const nonExistent = cache.get("nonexistent");
  console.log("Retrieved nonexistent:", nonExistent);

  const value2 = cache.get("test2");
  console.log("Retrieved test2:", value2);

  const status = cache.getCacheStatus();
  console.log("Final cache status:", status);

  const hitRate = status.metrics.hitRate;
  console.log(
    `Hit rate: ${hitRate.toFixed(2)}% (Expected ~66.67% for this test)`
  );

  return {
    isWorking: status.metrics.hits === 2 && status.metrics.misses === 1,
    metrics: status.metrics,
  };
}

const result = testCacheOperation();
console.log("Cache working correctly:", result.isWorking);
