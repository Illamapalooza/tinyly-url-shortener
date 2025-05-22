import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { RecentUrl } from "@/types/url";
import {
  fetchRecentUrls,
  clearRecentUrls,
  removeRecentUrl,
} from "@/services/api";

export function useRecentUrls() {
  const [recentUrls, setRecentUrls] = useState<RecentUrl[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFetchRecentUrls = async () => {
    setIsLoading(true);
    try {
      const urls = await fetchRecentUrls();
      setRecentUrls(urls);
    } catch (error) {
      console.error("Error fetching recent URLs:", error);
      toast({
        title: "Error",
        description: "Failed to fetch recent URLs",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearUrls = async () => {
    try {
      await clearRecentUrls();
      setRecentUrls([]);
      toast({
        title: "Success",
        description: "URL history cleared",
      });
    } catch (error) {
      console.error("Error clearing cache:", error);
      toast({
        title: "Error",
        description: "Failed to clear URL history",
        variant: "destructive",
      });
    }
  };

  const handleRemoveUrl = async (shortCode: string) => {
    try {
      await removeRecentUrl(shortCode);
      setRecentUrls((prevUrls) =>
        prevUrls.filter((url) => url.shortCode !== shortCode)
      );
      toast({
        title: "Success",
        description: "URL removed from history",
      });
    } catch (error) {
      console.error("Error removing URL:", error);
      toast({
        title: "Error",
        description: "Failed to remove URL from history",
        variant: "destructive",
      });
    }
  };

  return {
    recentUrls,
    isLoading,
    fetchRecentUrls: handleFetchRecentUrls,
    clearRecentUrls: handleClearUrls,
    removeUrl: handleRemoveUrl,
  };
}
