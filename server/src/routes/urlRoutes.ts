import express from "express";
import { UrlController } from "../controller/urlController";

const router = express.Router();
const urlController = new UrlController();

// Create a shortened URL
router.post("/", urlController.shortenUrl);

// Redirect to original URL
router.get("/:shortCode", urlController.redirectToUrl);

// Get URL statistics
router.get("/stats/:shortCode", urlController.getUrlStats);

// Get URL analytics
router.get("/analytics/:shortCode", urlController.getUrlAnalytics);

// List all URLs
router.get("/list/all", urlController.listUrls);

// Get all recent URLs from cache
router.get("/urls/recent", urlController.getRecentUrls);

// Clear URL cache
router.delete("/urls", urlController.clearUrls);

// Remove specific URL from cache
router.delete("/urls/:shortCode", urlController.removeUrl);

export default router;
