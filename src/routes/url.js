import express from "express";
import {
  createShortUrl,
  getUserUrls,
  getUrlStats,
} from "../controllers/url-controller.js";
import authMiddleware from "../middlewares/user-auth.middleware.js";
import shortenUrlSchema from "../validators/url.validator.js";
import { validate } from "../middlewares/validate.middleware.js";

const router = express.Router();

router.post(
  "/shortener",
  authMiddleware,
  validate(shortenUrlSchema),
  createShortUrl
);

router.get("/:get-urls", authMiddleware, getUserUrls);
router.get("/:shortCode/stats", authMiddleware, getUrlStats);

export default router;
