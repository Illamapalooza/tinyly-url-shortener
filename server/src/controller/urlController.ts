import { Request, Response } from "express";
import { UrlService } from "@app/services/urlService";
import { CreateUrlRequestDto } from "../dto/url-dto";

export class UrlController {
  private urlService: UrlService;

  constructor() {
    this.urlService = new UrlService();
  }

  shortenUrl = async (req: Request, res: Response): Promise<void> => {
    try {
      const { originalUrl, customSlug, expiration, utmParams } = req.body;

      if (!originalUrl) {
        res.status(400).json({ error: "Original URL is required" });
        return;
      }

      // Create the request object
      const requestData: CreateUrlRequestDto = {
        originalUrl,
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

  listUrls = async (_req: Request, res: Response): Promise<void> => {
    try {
      const urls = await this.urlService.getAllUrls();
      res.json(urls);
    } catch (error) {
      console.error("Error listing URLs:", error);
      res.status(500).json({ error: "Failed to list URLs" });
    }
  };

  getRecentUrls = async (_req: Request, res: Response): Promise<void> => {
    try {
      const recentUrls = this.urlService.getRecentUrlsFromCache();
      res.json(recentUrls);
    } catch (error) {
      console.error("Error getting recent URLs:", error);
      res.status(500).json({ error: "Failed to get recent URLs" });
    }
  };

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
