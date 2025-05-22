export type CreateUrlRequestDto = {
  originalUrl: string;
  customSlug?: string;
  expiration?: number;
  utmParams?: {
    source?: string;
    medium?: string;
    campaign?: string;
  };
};

export type ShortUrlResponseDto = {
  shortCode: string;
};

export type UrlClickDto = {
  id: number;
  shortCode: string;
  visitorId: string;
  deviceType: string | null;
  browser: string | null;
  os: string | null;
  ipAddress: string | null;
  clickedAt: string;
};

export type UrlAnalyticsDto = {
  shortCode: string;
  originalUrl: string;
  totalClicks: number;
  deviceInfo: {
    deviceTypes: Record<string, number>;
    browsers: Record<string, number>;
    operatingSystems: Record<string, number>;
  };
  clickHistory: {
    id: number;
    shortCode: string;
    visitorId: string;
    deviceType: string | null;
    browser: string | null;
    os: string | null;
    ipAddress: string | null;
    clickedAt: Date;
  }[];
  createdAt: string;
  expiresAt?: string;
};

export type UrlStatsDto = {
  shortCode: string;
  originalUrl: string;
  visitCount: number;
  createdAt: string;
  expiresAt?: string;
};

export type ListUrlsResponseDto = {
  id: number;
  shortCode: string;
  originalUrl: string;
  visitCount: number;
  createdAt: string;
  expiresAt?: string;
};

export type UrlResponseDto = {
  id: number;
  shortCode: string;
  originalUrl: string;
  visitCount: number;
  createdAt: string;
  expiresAt?: string;
};
