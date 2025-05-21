import { randomBytes } from "crypto";
import { db } from "../db/knex";
import {
  UrlResponseDto,
  ListUrlsResponseDto,
  CreateUrlRequestDto,
} from "../dto/url-dto";
import { CacheService } from "./cacheService";
import { CacheMetricsManager } from "./cacheMetricsManager";
import { globalCache } from "../rest-api";

export class UrlService {
  private cacheService: CacheService;

  constructor() {
    this.cacheService = new CacheService(3600);
  }

  private generateShortCode(length: number = 8): string {
    return randomBytes(length)
      .toString("base64")
      .replace(/[+/=]/g, "")
      .substring(0, length);
  }

  private processUrl(
    originalUrl: string,
    utmParams?: { source?: string; medium?: string; campaign?: string }
  ): string {
    if (
      !utmParams ||
      (!utmParams.source && !utmParams.medium && !utmParams.campaign)
    ) {
      return originalUrl;
    }

    try {
      const url = new URL(originalUrl);

      if (utmParams.source) {
        url.searchParams.append("utm_source", utmParams.source);
      }
      if (utmParams.medium) {
        url.searchParams.append("utm_medium", utmParams.medium);
      }
      if (utmParams.campaign) {
        url.searchParams.append("utm_campaign", utmParams.campaign);
      }

      return url.toString();
    } catch (error) {
      console.error("Error processing URL with UTM parameters:", error);
      return originalUrl;
    }
  }

  async createShortUrl(
    requestData: string | CreateUrlRequestDto
  ): Promise<UrlResponseDto> {
    // Handle both string and object input for backward compatibility
    let originalUrl: string;
    let customSlug: string | undefined;
    let expiration: number | undefined;
    let utmParams:
      | { source?: string; medium?: string; campaign?: string }
      | undefined;

    if (typeof requestData === "string") {
      originalUrl = requestData;
    } else {
      originalUrl = requestData.originalUrl;
      customSlug = requestData.customSlug;
      expiration = requestData.expiration;
      utmParams = requestData.utmParams;
    }

    // Process URL with UTM parameters if exist
    const processedUrl = this.processUrl(originalUrl, utmParams);

    // Use the custom slug if provided, otherwise generate a short code
    let shortCode = customSlug || this.generateShortCode();
    let codeExists = true;

    if (customSlug) {
      const existingUrl = await db("urls").where({ shortCode }).first();
      if (existingUrl) {
        throw new Error("Alias already in use");
      }
      codeExists = false;
    } else {
      while (codeExists) {
        const existingUrl = await db("urls").where({ shortCode }).first();

        if (!existingUrl) {
          codeExists = false;
        } else {
          shortCode = this.generateShortCode();
        }
      }
    }

    // Calculate expiration date if provided
    let expiresAt: Date | undefined;
    if (expiration && expiration > 0) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiration);
    }

    const urlData = {
      shortCode,
      originalUrl: processedUrl,
      visitCount: 0,
      createdAt: new Date(),
      expiresAt,
      utmParams: utmParams ? JSON.stringify(utmParams) : null,
    };

    const [newUrl] = await db("urls").insert(urlData).returning("*");

    this.cacheService.set(`url:${shortCode}`, newUrl);
    // Also set in global cache
    globalCache.set(`url:${shortCode}`, newUrl);

    return newUrl;
  }

  async getUrlByShortCode(shortCode: string): Promise<UrlResponseDto | null> {
    const cachedUrl = this.cacheService.get<UrlResponseDto>(`url:${shortCode}`);

    if (cachedUrl) {
      if (cachedUrl.expiresAt && new Date(cachedUrl.expiresAt) < new Date()) {
        // URL is expired, remove it from cache and database
        await this.removeUrlFromCache(shortCode);
        return null;
      }

      CacheMetricsManager.recordHit();

      return cachedUrl;
    }

    CacheMetricsManager.recordMiss();

    const url = await db("urls").where({ shortCode }).first();

    if (url) {
      // Check if URL is expired
      if (url.expiresAt && new Date(url.expiresAt) < new Date()) {
        // URL is expired, remove it from database
        await this.removeUrlFromCache(shortCode);
        return null;
      }

      // Add to cache for future requests
      this.cacheService.set(`url:${shortCode}`, url);
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

    const cachedUrl = this.cacheService.get<UrlResponseDto>(`url:${shortCode}`);

    if (cachedUrl) {
      cachedUrl.visitCount += 1;

      this.cacheService.set(`url:${shortCode}`, cachedUrl);
      globalCache.set(`url:${shortCode}`, cachedUrl);

      this.cacheService.updateTTL(`url:${shortCode}`, cachedUrl.visitCount);
      globalCache.updateTTL(`url:${shortCode}`, cachedUrl.visitCount);
    }
  }

  async getUrlStats(shortCode: string): Promise<UrlResponseDto | null> {
    const cachedUrl = this.cacheService.get<UrlResponseDto>(`url:${shortCode}`);

    if (cachedUrl) {
      CacheMetricsManager.recordHit();
      return cachedUrl;
    }

    CacheMetricsManager.recordMiss();

    // If not in cache, fetch from database
    const stats = await db("urls").where({ shortCode }).first();

    if (stats) {
      this.cacheService.set(`url:${shortCode}`, stats);
      globalCache.set(`url:${shortCode}`, stats);
    }

    return stats || null;
  }

  async getAllUrls(): Promise<ListUrlsResponseDto[]> {
    return db("urls").select("*").orderBy("createdAt", "desc");
  }

  getRecentUrlsFromCache(): UrlResponseDto[] {
    return globalCache.getAllRecentUrls<UrlResponseDto>();
  }

  async clearUrlCache(): Promise<void> {
    await db("urls").delete();

    globalCache.flush();
  }

  async removeUrlFromCache(shortCode: string): Promise<void> {
    await db("urls").where({ shortCode }).delete();

    globalCache.delete(`url:${shortCode}`);
  }
}
