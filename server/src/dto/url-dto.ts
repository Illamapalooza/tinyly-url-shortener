export type CreateUrlRequestDto = {
  originalUrl: string;
};

export type ShortUrlResponseDto = {
  shortCode: string;
};

export type UrlStatsDto = {
  shortCode: string;
  originalUrl: string;
  visitCount: number;
  createdAt: string;
};

export type ListUrlsResponseDto = {
  id: number;
  shortCode: string;
  originalUrl: string;
  visitCount: number;
  createdAt: string;
};

export type UrlResponseDto = {
  id: number;
  shortCode: string;
  originalUrl: string;
  visitCount: number;
  createdAt: string;
};
