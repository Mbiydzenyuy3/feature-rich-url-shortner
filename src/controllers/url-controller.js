//controller/url-controller.js
import { pool } from "../config/db.js";
import generateShortCode from "../utils/shortCodeGen.js";
import { logError } from "../utils/logger.js";

const createShortUrl = async (req, res) => {
  const { longUrl, expireInDays } = req.body;
  const userId = req.user?.id;

  const shortCode = generateShortCode();
  const expireAt = expireInDays
    ? new Date(Date.now() + expireInDays * 24 * 60 * 60 * 1000)
    : null;

  try {
    const result = await pool.query(
      `INSERT INTO urls (user_id, long_url, short_code, expire_at)
      VALUES ($1, $2, $3, $4)
      RETURNING short_code
      `,
      [userId, longUrl, shortCode, expireAt]
    );

    const baseurl = process.env.BASE_URL || "http://localhost:4000";
    res
      .status(201)
      .json({ shortUrl: `${baseurl}/${result.rows[0].short_code}` });
  } catch (error) {
    logError("Error creating short Url", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUserUrls = async (req, res) => {
  const userId = req.user?.id;

  try {
    const result = await pool.query(
      `
      SELECT short_code, long_url, created_at, expire_at, click_count FROM urls WHERE id = $1 ORDER BY created_at DESC 
    `,
      [userId]
    );

    return res.status(200).json({ urls: result.rows });
  } catch (error) {
    logError("Error fetching user URLs:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getUrlStats = async (req, res) => {
  const { shortCode } = req.params;
  const userId = req.user?.id;

  try {
    const result = await pool.query(
      `SELECT * FROM urls WHERE short_code = $1 AND id = $2`,
      [shortCode, userId]
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ message: "No stats found or access denied" });
    }

    return res.status(200).json({ stats: result.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error retrieving stats" });
  }
};

export { createShortUrl, getUserUrls, getUrlStats };
