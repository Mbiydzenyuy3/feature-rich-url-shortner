import { logError } from "../utils/logger.js";
import { pool } from "../config/db.js";

const getRedirectUrl = async (req, res) => {
  const { shortCode } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT long_url, expire_at, click_count FROM urls WHERE short_code = $1
    `,
      [shortCode]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Short url not found" });
    }

    const { long_url, expire_at } = result.rows[0];

    if (expire_at && new Date() > new Date(expire_at)) {
      return res.status(410).json({ message: "This link has expired" });
    }

    //Increment click count
    await pool.query(
      `
       UPDATE urls SET click_count = click_count + 1 WHERE short_code = $1
    `,
      [shortCode]
    );

    return res.redirect(302, long_url);
  } catch (error) {
    logError("Redirect error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { getRedirectUrl };
