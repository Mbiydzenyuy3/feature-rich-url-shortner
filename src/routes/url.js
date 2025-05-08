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
  "/url-shortener",
  authMiddleware,
  validate(shortenUrlSchema),
  createShortUrl
);

router.get("/my-urls", authMiddleware, getUserUrls);
router.get("/shorten/:shortCode/stats", authMiddleware, getUrlStats);

export default router;
