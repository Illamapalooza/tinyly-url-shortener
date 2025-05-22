import axios from "axios";
import BASE_URL from "@/configs/baseUrl";
import { RecentUrl, UrlAnalytics } from "@/types/url";

export const fetchRecentUrls = async (): Promise<RecentUrl[]> => {
  const response = await axios.get<RecentUrl[]>(`${BASE_URL}/urls/recent`);
  return response.data;
};

export const clearRecentUrls = async (): Promise<void> => {
  await axios.delete(`${BASE_URL}/urls`);
};

export const removeRecentUrl = async (shortCode: string): Promise<void> => {
  await axios.delete(`${BASE_URL}/urls/${shortCode}`);
};

export const getFullUrl = (shortCode: string): string => {
  return `${BASE_URL}/${shortCode}`;
};

export const fetchUrlAnalytics = async (
  shortCode: string
): Promise<UrlAnalytics> => {
  const response = await axios.get<UrlAnalytics>(
    `${BASE_URL}/analytics/${shortCode}`
  );
  return response.data;
};
