import { Request, Response } from "express";
import { UrlService } from "@app/services/urlService";

export class UrlController {
  private urlService: UrlService;

  constructor() {
    this.urlService = new UrlService();
  }

  shortenUrl = async (req: Request, res: Response): Promise<void> => {
    try {
      const { originalUrl } = req.body;

      if (!originalUrl) {
        res.status(400).json({ error: "Original URL is required" });
        return;
      }

      const shortUrl = await this.urlService.createShortUrl(originalUrl);

      res.status(200).json(shortUrl);
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
}
