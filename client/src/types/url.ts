/**
 * Request for creating a shortened URL
 */
export type CreateUrlRequest = {
  originalUrl: string;
  customSlug?: string;
  expiration?: number;
  utmParams?: {
    source?: string;
    medium?: string;
    campaign?: string;
  };
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
  expiresAt?: string; // ISO date string format
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
  expiresAt?: string;
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

/**
 * URL click data for analytics
 */
export type UrlClick = {
  id: number;
  shortCode: string;
  visitorId: string;
  deviceType: string | null;
  browser: string | null;
  os: string | null;
  ipAddress: string | null;
  clickedAt: string;
};

/**
 * URL analytics data
 */
export type UrlAnalytics = {
  shortCode: string;
  originalUrl: string;
  totalClicks: number;
  deviceInfo: {
    deviceTypes: Record<string, number>;
    browsers: Record<string, number>;
    operatingSystems: Record<string, number>;
  };
  clickHistory: UrlClick[];
  createdAt: string;
  expiresAt?: string;
};
