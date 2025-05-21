/**
 * Request for creating a shortened URL
 */
export type CreateUrlRequest = {
  originalUrl: string;
};

/**
 * Response  for a shortened URL
 */
export type UrlResponse = {
  id: number;
  shortCode: string;
  originalUrl: string;
  visitCount: number;
  createdAt: string; // ISO date string format
};

/**
 * Simple response with just the short code
 */
export type ShortUrlResponse = {
  shortCode: string;
};

/**
 * Stats response for a URL
 */
export type UrlStats = {
  shortCode: string;
  originalUrl: string;
  visitCount: number;
  createdAt: string;
};

/**
 * Recent URL from cache
 */
export type RecentUrl = {
  id: number;
  shortCode: string;
  originalUrl: string;
  visitCount: number;
  createdAt: string;
};
