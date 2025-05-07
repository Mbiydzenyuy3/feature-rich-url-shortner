//controller/url-controller.js
import { pool } from "../config/db.js";
import generateShortCode from "../utils/shortCodeGen.js";
import { logError } from "../utils/logger.js";

const createShortUrl = async (req,  res)=> {
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
      `, [userId, longUrl, shortCode, expireAt]
    );

    const baseurl = process.env.BASE_URL || "http://localhost:4000"
    res.status(201).json({shortUrl: `${baseurl}/${result.rows[0].short_code}`})
  } catch (error) {
    logError("Error creating short Url", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export {createShortUrl}