//controller/url-controller.js
import { pool } from "../config/db.js";
import generateShortCode from "../utils/shortCodeGen.js";
import { logDebug, logError, logInfo } from "../utils/logger.js";

const createShortUrl = async (req, res, next) => {
  const { longUrl, customCode, expireInDays } = req.body;
  const userId = req.user.id;
  logDebug("Received data in createShortUrl:", req.body); // Add this log to see the request data
  try {
    if (customCode) {
      const checkCustomCode = `SELECT * FROM urls WHERE short_code=$1`;
      const checkCustomCodeResult = await pool.query(checkCustomCode, [
        customCode,
      ]);

      if (checkCustomCodeResult.rows.length > 0) {
        logError(`Custom code ${customCode} is already in use`);
        return res.status(409).json({
          message:
            "Custom Code conflict: Custom code is already in use. Try another one",
        });
      }
    }

    //  const shortCode = generateShortCode();
    const generatedShortCode = generateShortCode(6);
    const shortCode = customCode || generatedShortCode;
    const expireAt = expireInDays
      ? new Date(Date.now() + expireInDays * 24 * 60 * 60 * 1000)
      : null;

    const host =
      process.env.NODE_ENV === "production"
        ? "feature-rich-url-shortner-production.up.railway.app"
        : req.get("host");

    const shortUrl = `${req.protocol}://${host}/s/${shortCode}`;

    const insertUrlInfoQuery = `
      INSERT INTO urls (long_url, short_code, expire_at, user_id, short_url)
      VALUES($1, $2, $3, $4, $5)
      RETURNING created_at, expire_at`;
    const insertUrlInfoResult = await pool.query(insertUrlInfoQuery, [
      longUrl,
      shortCode,
      expireAt,
      userId,
      shortUrl,
    ]);

    logInfo(`Short URL created: ${shortCode} for user ${userId}`);
    res.status(201).json({
      message: "Short URL created successfully",
      custom_code: shortCode,
      shortened_URL: shortUrl,
      original_URL: longUrl,
      created_at: insertUrlInfoResult.rows[0].created_at,
      expire_at: insertUrlInfoResult.rows[0].expire_at || "No expiration time",
    });
  } catch (error) {
    logError("Error creating short Url", error);
    res.status(500).json({
      message: "Error creating short url, double check for wrong field or data",
    });
  }
};

const getUserUrls = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const result = `
      SELECT * FROM urls WHERE user_id = $1 ORDER BY created_at DESC
    `;
    const getUrlsResult = await pool.query(result, [userId]);

    if (getUrlsResult.rows.length === 0) {
      logError("There are no shortened urls for this account");
      return res.status(404).json({
        message: `NO shortened urls have been created for this user: ${userId}`,
      });
    }
    return res.status(200).json({
      message: "Available urls",
      urls: getUrlsResult.rows,
    });
  } catch (error) {
    logError(`
      Error fetching urls for user ${userId}`);
    return res
      .status(500)
      .json({ message: "Failed to fetch urls", error: error.message });
  }
};

const getUrlStats = async (req, res, next) => {
  const { shortCode } = req.params;
  const userId = req.user.id;

  try {
    const urlStatsQuery = `SELECT id, long_url, click_count, created_at, expire_at, short_code FROM urls WHERE short_code=$1 AND user_id=$2`;
    const urlStatResult = await pool.query(urlStatsQuery, [shortCode, userId]);

    if (urlStatResult.rowCount === 0) {
      return res
        .status(404)
        .json({ message: "No stats found or access denied" });
    }

    const url = urlStatResult.rows[0];

    const baseUrl = process.env.BASE_URL || "http://localhost:4000";

    return res.json({
      long_url: url.long_url,
      short_url: `${baseUrl}/s/${url.short_code}`,
      clicks: url.clicks,
      createdAt: url.created_at,
      expireAt: url.expire_at,
    });
  } catch (err) {
    logError(err);
    return res.status(500).json({ message: "Error retrieving stats" });
  }
};

export { createShortUrl, getUserUrls, getUrlStats };
