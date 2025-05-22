import { useState, useEffect } from "react";
import { fetchUrlAnalytics } from "@/services/api";
import { UrlAnalytics } from "@/types/url";

export function useUrlAnalytics(shortCode: string) {
  const [analytics, setAnalytics] = useState<UrlAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAnalytics() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchUrlAnalytics(shortCode);
        setAnalytics(data);
      } catch (err) {
        console.error("Error fetching URL analytics:", err);
        setError("Failed to load analytics data");
      } finally {
        setIsLoading(false);
      }
    }

    loadAnalytics();
  }, [shortCode]);

  return { analytics, isLoading, error };
}
