import { getFullUrl } from "@/services/urlCacheService";

export function useVisitUrl() {
  const visitUrl = (shortCode: string) => {
    const fullUrl = getFullUrl(shortCode);
    window.open(fullUrl, "_blank", "noopener,noreferrer");
  };

  return { visitUrl };
}
