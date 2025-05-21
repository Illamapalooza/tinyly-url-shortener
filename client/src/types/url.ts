/**
 * URL Shortener DTOs (Data Transfer Objects)
 */

/**
 * Request DTO for creating a shortened URL
 */
export type CreateUrlRequestDto = {
  originalUrl: string;
};

/**
 * Response DTO for a shortened URL
 */
export type UrlResponseDto = {
  id: number;
  shortCode: string;
  originalUrl: string;
  visitCount: number;
  createdAt: string; // ISO date string format
};

/**
 * Simple response with just the short code
 */
export type ShortUrlResponseDto = {
  shortCode: string;
};

/**
 * Stats response for a URL
 */
export type UrlStatsDto = {
  shortCode: string;
  originalUrl: string;
  visitCount: number;
  createdAt: string;
};
