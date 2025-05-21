import { randomBytes } from "crypto";
import { db } from "../db/knex";
import { UrlResponseDto, ListUrlsResponseDto } from "../dto/url-dto";

export class UrlService {
  private generateShortCode(length: number = 6): string {
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

    return newUrl;
  }

  async getUrlByShortCode(shortCode: string): Promise<UrlResponseDto | null> {
    const url = await db("urls").where({ shortCode }).first();

    return url || null;
  }

  async incrementVisitCount(shortCode: string): Promise<void> {
    await db("urls").where({ shortCode }).increment("visitCount", 1);
  }

  async getUrlStats(shortCode: string): Promise<UrlResponseDto | null> {
    const stats = await db("urls").where({ shortCode }).first();

    return stats || null;
  }

  async getAllUrls(): Promise<ListUrlsResponseDto[]> {
    return db("urls").select("*").orderBy("createdAt", "desc");
  }
}
