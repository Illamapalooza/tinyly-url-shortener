import * as crypto from "crypto";

/**
 * Generates a random short code for URLs
 * @param length - The length of the short code
 * @returns A random short code
 */
export function generateShortCode(length: number = 8): string {
  return crypto
    .randomBytes(length)
    .toString("base64")
    .replace(/[+/=]/g, "")
    .substring(0, length);
}

/**
 * Generates a visitor ID for analytics
 * @returns A random visitor ID
 */
export function generateVisitorId(): string {
  return crypto.randomBytes(16).toString("hex");
}

/**
 * Processes a URL with UTM parameters
 * @param originalUrl - The original URL to process
 * @param utmParams - The UTM parameters to add to the URL
 * @returns The processed URL
 */
export function processUrl(
  originalUrl: string,
  utmParams?: { source?: string; medium?: string; campaign?: string }
): string {
  if (
    !utmParams ||
    (!utmParams.source && !utmParams.medium && !utmParams.campaign)
  ) {
    return originalUrl;
  }

  try {
    const url = new URL(originalUrl);

    if (utmParams.source) {
      url.searchParams.append("utm_source", utmParams.source);
    }
    if (utmParams.medium) {
      url.searchParams.append("utm_medium", utmParams.medium);
    }
    if (utmParams.campaign) {
      url.searchParams.append("utm_campaign", utmParams.campaign);
    }

    return url.toString();
  } catch (error) {
    console.error("Error processing URL with UTM parameters:", error);
    return originalUrl;
  }
}
