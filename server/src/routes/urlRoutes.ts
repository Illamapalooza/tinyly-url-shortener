import express from "express";
import { UrlController } from "../controller/urlController";

const router = express.Router();
const urlController = new UrlController();

/**
 * @swagger
 * components:
 *   schemas:
 *     UrlRequest:
 *       type: object
 *       required:
 *         - originalUrl
 *       properties:
 *         originalUrl:
 *           type: string
 *           description: The URL to be shortened
 *     UrlResponse:
 *       type: object
 *       properties:
 *         shortCode:
 *           type: string
 *           description: The short code for the URL
 *         shortUrl:
 *           type: string
 *           description: The shortened URL
 *         originalUrl:
 *           type: string
 *           description: The original URL
 */

/**
 * @swagger
 * /:
 *   post:
 *     summary: Create a shortened URL
 *     tags: [URLs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UrlRequest'
 *     responses:
 *       201:
 *         description: URL shortened successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UrlResponse'
 */
router.post("/", urlController.shortenUrl);

/**
 * @swagger
 * /{shortCode}:
 *   get:
 *     summary: Redirect to original URL
 *     tags: [URLs]
 *     parameters:
 *       - in: path
 *         name: shortCode
 *         schema:
 *           type: string
 *         required: true
 *         description: Short code for the URL
 *     responses:
 *       302:
 *         description: Redirect to the original URL
 *       404:
 *         description: URL not found
 */
router.get("/:shortCode", urlController.redirectToUrl);

/**
 * @swagger
 * /stats/{shortCode}:
 *   get:
 *     summary: Get URL statistics
 *     tags: [URLs]
 *     parameters:
 *       - in: path
 *         name: shortCode
 *         schema:
 *           type: string
 *         required: true
 *         description: Short code for the URL
 *     responses:
 *       200:
 *         description: URL statistics retrieved successfully
 *       404:
 *         description: URL not found
 */
router.get("/stats/:shortCode", urlController.getUrlStats);

/**
 * @swagger
 * /analytics/{shortCode}:
 *   get:
 *     summary: Get URL analytics
 *     tags: [URLs]
 *     parameters:
 *       - in: path
 *         name: shortCode
 *         schema:
 *           type: string
 *         required: true
 *         description: Short code for the URL
 *     responses:
 *       200:
 *         description: URL analytics retrieved successfully
 *       404:
 *         description: URL not found
 */
router.get("/analytics/:shortCode", urlController.getUrlAnalytics);

/**
 * @swagger
 * /list/all:
 *   get:
 *     summary: List all URLs
 *     tags: [URLs]
 *     responses:
 *       200:
 *         description: List of all URLs retrieved successfully
 */
router.get("/list/all", urlController.listUrls);

/**
 * @swagger
 * /urls/recent:
 *   get:
 *     summary: Get all recent URLs from cache
 *     tags: [URLs]
 *     responses:
 *       200:
 *         description: Recent URLs retrieved successfully
 */
router.get("/urls/recent", urlController.getRecentUrls);

/**
 * @swagger
 * /urls:
 *   delete:
 *     summary: Clear URL cache and db
 *     tags: [URLs]
 *     responses:
 *       200:
 *         description: URL cache and db cleared successfully
 */
router.delete("/urls", urlController.clearUrls);

/**
 * @swagger
 * /urls/{shortCode}:
 *   delete:
 *     summary: Remove specific URL from db and cache
 *     tags: [URLs]
 *     parameters:
 *       - in: path
 *         name: shortCode
 *         schema:
 *           type: string
 *         required: true
 *         description: Short code for the URL
 *     responses:
 *       200:
 *         description: URL removed from db and cache successfully
 *       404:
 *         description: URL not found
 */
router.delete("/urls/:shortCode", urlController.removeUrl);

export default router;
