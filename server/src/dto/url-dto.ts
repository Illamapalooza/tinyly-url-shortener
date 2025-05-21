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
