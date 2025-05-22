import { CacheService } from "../services/cacheService";

export function testCacheOperation() {
  console.log("Testing cache functionality...");

  const cache = new CacheService(600); // 10 minute TTL

  console.log("Initial cache status:", cache.getCacheStatus());

  cache.set("test1", { value: "test 1" });
  cache.set("test2", { value: "test 2" });

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

if (require.main === module) {
  const result = testCacheOperation();
  console.log("Cache working correctly:", result.isWorking);
}
