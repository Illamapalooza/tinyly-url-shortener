import axios from "axios";
import BASE_URL from "@/configs/baseUrl";
import { RecentUrl } from "@/types/url";

export const fetchRecentUrls = async (): Promise<RecentUrl[]> => {
  const response = await axios.get<RecentUrl[]>(`${BASE_URL}/cache/recent`);
  return response.data;
};

export const clearRecentUrls = async (): Promise<void> => {
  await axios.delete(`${BASE_URL}/cache`);
};

export const removeRecentUrl = async (shortCode: string): Promise<void> => {
  await axios.delete(`${BASE_URL}/cache/${shortCode}`);
};

export const getFullUrl = (shortCode: string): string => {
  return `${BASE_URL}/${shortCode}`;
};
