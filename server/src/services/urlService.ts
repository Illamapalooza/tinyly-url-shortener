import { randomBytes } from "crypto";
import { db } from "../db/knex";
import { UrlResponseDto, ListUrlsResponseDto } from "../dto/url-dto";
import { CacheService } from "./cacheService";
import { CacheMetricsManager } from "./cacheMetricsManager";
import { globalCache } from "../rest-api";

export class UrlService {
  private cacheService: CacheService;

  constructor() {
    // Initialize cache with 1 hour TTL
    this.cacheService = new CacheService(3600);
  }

  private generateShortCode(length: number = 8): string {
    return randomBytes(length)
      .toString("base64")
      .replace(/[+/=]/g, "")
      .substring(0, length);
  }

  async createShortUrl(originalUrl: string): Promise<UrlResponseDto> {
    let shortCode = this.generateShortCode();
    let codeExists = true;

    while (codeExists) {
      const existingUrl = await db("urls").where({ shortCode }).first();

      if (!existingUrl) {
        codeExists = false;
      } else {
        shortCode = this.generateShortCode();
      }
    }

    const [newUrl] = await db("urls")
      .insert({
        shortCode,
        originalUrl,
        visitCount: 0,
        createdAt: new Date(),
      })
      .returning("*");

    this.cacheService.set(`url:${shortCode}`, newUrl);
    // Also set in global cache
    globalCache.set(`url:${shortCode}`, newUrl);

    return newUrl;
  }

  async getUrlByShortCode(shortCode: string): Promise<UrlResponseDto | null> {
    // First check the cache
    const cachedUrl = this.cacheService.get<UrlResponseDto>(`url:${shortCode}`);

    if (cachedUrl) {
      // Record cache hit in metrics
      CacheMetricsManager.recordHit();

      console.log("cache hit", CacheMetricsManager.getMetrics());
      return cachedUrl;
    }

    // Record cache miss in metrics
    CacheMetricsManager.recordMiss();

    // If not in cache, fetch from database
    const url = await db("urls").where({ shortCode }).first();

    if (url) {
      // Add to cache for future requests
      this.cacheService.set(`url:${shortCode}`, url);
      // Also set in global cache
      globalCache.set(`url:${shortCode}`, url);

      // Update TTL based on visit count for frequently accessed URLs
      if (url.visitCount > 10) {
        this.cacheService.updateTTL(`url:${shortCode}`, url.visitCount);
        globalCache.updateTTL(`url:${shortCode}`, url.visitCount);
      }
    }

    return url || null;
  }

  async incrementVisitCount(shortCode: string): Promise<void> {
    await db("urls").where({ shortCode }).increment("visitCount", 1);

    // Update the cached version if it exists
    const cachedUrl = this.cacheService.get<UrlResponseDto>(`url:${shortCode}`);

    if (cachedUrl) {
      cachedUrl.visitCount += 1;

      // Update the cache with the new visit count
      this.cacheService.set(`url:${shortCode}`, cachedUrl);
      globalCache.set(`url:${shortCode}`, cachedUrl);

      // Adjust TTL based on updated visit count
      this.cacheService.updateTTL(`url:${shortCode}`, cachedUrl.visitCount);
      globalCache.updateTTL(`url:${shortCode}`, cachedUrl.visitCount);
    }
  }

  async getUrlStats(shortCode: string): Promise<UrlResponseDto | null> {
    // First check the cache
    const cachedUrl = this.cacheService.get<UrlResponseDto>(`url:${shortCode}`);

    if (cachedUrl) {
      // Record cache hit in metrics
      CacheMetricsManager.recordHit();
      return cachedUrl;
    }

    // Record cache miss in metrics
    CacheMetricsManager.recordMiss();

    // If not in cache, fetch from database
    const stats = await db("urls").where({ shortCode }).first();

    if (stats) {
      // Add to cache for future requests
      this.cacheService.set(`url:${shortCode}`, stats);
      globalCache.set(`url:${shortCode}`, stats);
    }

    return stats || null;
  }

  async getAllUrls(): Promise<ListUrlsResponseDto[]> {
    // This method intentionally doesn't use cache as it needs the latest list
    return db("urls").select("*").orderBy("createdAt", "desc");
  }

  getRecentUrlsFromCache(): UrlResponseDto[] {
    return globalCache.getAllRecentUrls<UrlResponseDto>();
  }

  async clearUrlCache(): Promise<void> {
    // Clear all URLs from the database
    await db("urls").delete();

    // Also clear the cache
    globalCache.flush();
  }

  async removeUrlFromCache(shortCode: string): Promise<void> {
    // Remove the URL from the database
    await db("urls").where({ shortCode }).delete();

    // Also remove from cache
    globalCache.delete(`url:${shortCode}`);
  }
}
