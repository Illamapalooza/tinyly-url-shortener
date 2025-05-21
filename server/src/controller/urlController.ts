import { Request, Response } from "express";
import { UrlService } from "@app/services/urlService";
import { CreateUrlRequestDto } from "../dto/url-dto";

export class UrlController {
  private urlService: UrlService;

  constructor() {
    this.urlService = new UrlService();
  }

  /**
   * Validates if a string is a proper URL
   * @param url URL string to validate
   * @returns True if valid URL, false otherwise
   */
  private isValidUrl(url: string): boolean {
    try {
      new URL(url);

      const urlPattern =
        /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/;
      return urlPattern.test(url);
    } catch (err) {
      return false;
    }
  }

  /**
   * Shortens a URL
   * @param req Request object containing the original URL, custom slug, expiration, and UTM parameters
   * @param res Response object
   * @returns void
   */
  shortenUrl = async (req: Request, res: Response): Promise<void> => {
    try {
      const { originalUrl, customSlug, expiration, utmParams } = req.body;

      if (!originalUrl) {
        res.status(400).json({ error: "Original URL is required" });
        return;
      }

      if (!this.isValidUrl(originalUrl)) {
        res.status(400).json({
          error:
            "Invalid URL format. Please provide a valid URL (e.g., https://example.com)",
        });
        return;
      }

      let normalizedUrl = originalUrl;
      if (!/^https?:\/\//i.test(originalUrl)) {
        normalizedUrl = `https://${originalUrl}`;
      }

      const requestData: CreateUrlRequestDto = {
        originalUrl: normalizedUrl,
        customSlug,
        expiration,
        utmParams,
      };

      try {
        const shortUrl = await this.urlService.createShortUrl(requestData);
        res.status(200).json(shortUrl);
      } catch (error) {
        if (
          error instanceof Error &&
          error.message === "Custom slug already in use"
        ) {
          res.status(409).json({ error: "Custom slug already in use" });
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error("Error shortening URL:", error);
      res.status(500).json({ error: "Failed to shorten URL" });
    }
  };

  /**
   * Redirects to a URL
   * @param req Request object containing the short code
   * @param res Response object
   * @returns void
   */
  redirectToUrl = async (req: Request, res: Response): Promise<void> => {
    try {
      const { shortCode } = req.params;

      const url = await this.urlService.getUrlByShortCode(shortCode);

      if (!url) {
        res.status(404).json({ error: "Short URL not found" });
        return;
      }

      // Increment the visit count
      await this.urlService.incrementVisitCount(shortCode);

      res.redirect(url.originalUrl);
    } catch (error) {
      console.error("Error redirecting to URL:", error);
      res.status(500).json({ error: "Failed to redirect to URL" });
    }
  };

  /**
   * Gets the stats for a URL
   * @param req Request object containing the short code
   * @param res Response object
   * @returns void
   */
  getUrlStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const { shortCode } = req.params;

      const stats = await this.urlService.getUrlStats(shortCode);

      if (!stats) {
        res.status(404).json({ error: "URL not found" });
        return;
      }

      res.json(stats);
    } catch (error) {
      console.error("Error getting URL stats:", error);
      res.status(500).json({ error: "Failed to get URL stats" });
    }
  };

  /**
   * Lists all URLs
   * @param req Request object
   * @param res Response object
   * @returns void
   */
  listUrls = async (_req: Request, res: Response): Promise<void> => {
    try {
      const urls = await this.urlService.getAllUrls();
      res.json(urls);
    } catch (error) {
      console.error("Error listing URLs:", error);
      res.status(500).json({ error: "Failed to list URLs" });
    }
  };

  /**
   * Gets the recent URLs
   * @param req Request object
   * @param res Response object
   * @returns void
   */
  getRecentUrls = async (_req: Request, res: Response): Promise<void> => {
    try {
      const recentUrls = this.urlService.getRecentUrlsFromCache();
      res.json(recentUrls);
    } catch (error) {
      console.error("Error getting recent URLs:", error);
      res.status(500).json({ error: "Failed to get recent URLs" });
    }
  };

  /**
   * Clears the URL cache
   * @param req Request object
   * @param res Response object
   * @returns void
   */
  clearUrlCache = async (_req: Request, res: Response): Promise<void> => {
    try {
      await this.urlService.clearUrlCache();
      res.json({
        message: "URL cache and database records cleared successfully",
      });
    } catch (error) {
      console.error("Error clearing URL cache and database:", error);
      res.status(500).json({ error: "Failed to clear URL cache and database" });
    }
  };

  /**
   * Removes a URL from the cache
   * @param req Request object containing the short code
   * @param res Response object
   * @returns void
   */
  removeUrlFromCache = async (req: Request, res: Response): Promise<void> => {
    try {
      const { shortCode } = req.params;
      await this.urlService.removeUrlFromCache(shortCode);
      res.json({
        message: `URL with shortCode ${shortCode} removed from cache and database`,
      });
    } catch (error) {
      console.error("Error removing URL from cache and database:", error);
      res
        .status(500)
        .json({ error: "Failed to remove URL from cache and database" });
    }
  };
}
