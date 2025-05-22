import BASE_URL from "@/configs/baseUrl";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getFullUrl = (shortCode: string): string => {
  return `${BASE_URL}/${shortCode}`;
};
