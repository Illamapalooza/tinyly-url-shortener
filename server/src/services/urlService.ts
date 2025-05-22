import { db } from "../db/knex";
import {
  UrlResponseDto,
  ListUrlsResponseDto,
  CreateUrlRequestDto,
  UrlAnalyticsDto,
} from "../dto/url-dto";
import { CacheService } from "./cacheService";
import { CacheManager } from "./cacheManager";
import { globalCache } from "../rest-api";
import { generateShortCode, generateVisitorId, processUrl } from "../utils";

export class UrlService {
  private cacheService: CacheService;

  constructor() {
    // Get the URL-specific cache from the CacheManager
    this.cacheService = CacheManager.getInstance().getCache("urlCache", 3600);
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

    const processedUrl = processUrl(originalUrl, utmParams);

    // Use the custom slug if provided, otherwise generate short code
    let shortCode = customSlug || generateShortCode();
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
          shortCode = generateShortCode();
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
        await this.removeUrl(shortCode);
        return null;
      }

      console.log("URL found in cache", cachedUrl);

      return cachedUrl;
    }

    const url = await db("urls").where({ shortCode }).first();

    if (url) {
      if (url.expiresAt && new Date(url.expiresAt) < new Date()) {
        // URL is expired, remove it from database
        await this.removeUrl(shortCode);
        return null;
      }

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

  async incrementVisitCount(
    shortCode: string,
    visitorInfo?: {
      visitorId?: string;
      deviceType?: string;
      browser?: string;
      os?: string;
      ipAddress?: string;
    }
  ): Promise<void> {
    await db("urls").where({ shortCode }).increment("visitCount", 1);

    // Handle visitor tracking for analytics
    if (visitorInfo) {
      const visitorId = visitorInfo.visitorId || generateVisitorId();

      await db("url_clicks").insert({
        shortCode,
        visitorId,
        deviceType: visitorInfo.deviceType || null,
        browser: visitorInfo.browser || null,
        os: visitorInfo.os || null,
        ipAddress: visitorInfo.ipAddress || null,
        clickedAt: new Date(),
      });
    }

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
      return cachedUrl;
    }

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

  async clearUrls(): Promise<void> {
    await db("urls").delete();
    await db("url_clicks").delete();

    globalCache.flush();
  }

  async getUrlAnalytics(shortCode: string): Promise<UrlAnalyticsDto | null> {
    const url = await db("urls").where({ shortCode }).first();

    if (!url) {
      return null;
    }

    const clicks = await db("url_clicks")
      .where({ shortCode })
      .orderBy("clickedAt", "desc");

    // Calculate device statistics
    const deviceTypes: Record<string, number> = {};
    const browsers: Record<string, number> = {};
    const operatingSystems: Record<string, number> = {};

    clicks.forEach((click) => {
      // Count device types
      if (click.deviceType) {
        deviceTypes[click.deviceType] =
          (deviceTypes[click.deviceType] || 0) + 1;
      }

      // Count browsers
      if (click.browser) {
        browsers[click.browser] = (browsers[click.browser] || 0) + 1;
      }

      // Count operating systems
      if (click.os) {
        operatingSystems[click.os] = (operatingSystems[click.os] || 0) + 1;
      }
    });

    return {
      shortCode: url.shortCode,
      originalUrl: url.originalUrl,
      totalClicks: url.visitCount,
      deviceInfo: {
        deviceTypes,
        browsers,
        operatingSystems,
      },
      clickHistory: clicks,
      createdAt: url.createdAt,
      expiresAt: url.expiresAt,
    };
  }

  async removeUrl(shortCode: string): Promise<void> {
    await db("urls").where({ shortCode }).delete();
    await db("url_clicks").where({ shortCode }).delete();

    globalCache.delete(`url:${shortCode}`);
  }
}
