import { useState } from "react";
import axios, { AxiosError } from "axios";
import BASE_URL from "@/configs/baseUrl";
import { CreateUrlRequest, ShortUrlResponse } from "@/types/url";
import { UrlFormValues } from "../types";

export function useUrlShortener() {
  const [shortUrl, setShortUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const shortenUrl = async (values: UrlFormValues) => {
    setIsLoading(true);

    try {
      const requestData: CreateUrlRequest = {
        originalUrl: values.longUrl,
        customSlug: values.customSlug,
        expiration: values.expiration,
        utmParams: {
          source: values.utmSource,
          medium: values.utmMedium,
          campaign: values.utmCampaign,
        },
      };

      const response = await axios.post<ShortUrlResponse>(
        `${BASE_URL}`,
        requestData
      );

      if (response.status !== 200) {
        throw new Error("Failed to create short URL");
      }

      const data = response.data;
      const fullShortUrl = `${BASE_URL}/${data.shortCode}`;
      setShortUrl(fullShortUrl);
      return { success: true };
    } catch (err) {
      console.error("Error shortening URL:", err);
      const errorMessage =
        err instanceof AxiosError && err.response?.data?.error
          ? err.response.data.error
          : "Failed to shorten URL";

      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    shortUrl,
    isLoading,
    shortenUrl,
  };
}
