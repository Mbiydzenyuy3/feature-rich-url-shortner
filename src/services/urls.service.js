// src/services/url.service.js
import { pool } from "../config/db.js";
import generateShortCode from "../utils/shortCodeGen.js";

export const createShortUrlService = async ({
  longUrl,
  customCode,
  expireAt,
  userId,
}) => {
  const shortCode = customCode || generateShortCode(6);

  // Check for custom code conflict
  if (customCode) {
    const existing = await pool.query(
      "SELECT 1 FROM urls WHERE short_code=$1",
      [customCode]
    );
    if (existing.rowCount > 0) {
      throw new Error("Custom Code conflict");
    }
  }

  // Use BASE_URL
  const baseUrl = process.env.BASE_URL;
  const shortUrl = `${baseUrl}/s/${shortCode}`;

  // Normalize expireAt
  const expireDate = expireAt ? new Date(expireAt) : null;

  const insertQuery = `
    INSERT INTO urls (long_url, short_code, expire_at, user_id, short_url, click_count)
    VALUES ($1, $2, $3, $4, $5, 0)
    RETURNING custom_code, short_url, long_url, created_at, expire_at
  `;
  const values = [longUrl, shortCode, expireDate, userId, shortUrl];

  const result = await pool.query(insertQuery, values);
  return result.rows[0];
};

export const getUserUrlsService = async (userId) => {
  const result = await pool.query(
    `SELECT * FROM urls WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId]
  );
  return result.rows;
};

export const getUrlStatsService = async (customCode, userId) => {
  const result = await pool.query(
    `SELECT long_url, click_count, created_at, expire_at FROM urls WHERE short_code = $1 AND user_id = $2`,
    [customCode, userId]
  );
  if (result.rowCount === 0) return null;

  const url = result.rows[0];
  const shortUrl = `${process.env.BASE_URL}/s/${customCode}`;
  return { ...url, short_url: shortUrl };
};

export const handleRedirectService = async (customCode) => {
  const result = await pool.query(
    `SELECT id, long_url, expire_at, click_count FROM urls WHERE short_code = $1`,
    [customCode]
  );
  if (result.rowCount === 0) return { status: "not_found" };

  const { long_url, expire_at, click_count, id } = result.rows[0];
  if (expire_at && new Date() > new Date(expire_at))
    return { status: "expired" };

  // Update click count
  await pool.query(
    `UPDATE urls SET click_count = click_count + 1 WHERE id = $1`,
    [id]
  );
  await pool.query(`INSERT INTO click_logs (url_id) VALUES ($1)`, [id]);

  return { status: "ok", redirectTo: long_url, clicks: click_count + 1 };
};
