import { logDebug, logError, logInfo } from "../utils/logger.js";
import { pool } from "../config/db.js";

const getRedirectUrl = async (req, res) => {
  const { shortCode } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT id, long_url, expires_at, click_count FROM urls WHERE short_code = $1
    `,
      [shortCode]
    );

    if (result.rowCount === 0) {
      logDebug(`Short code not found: ${shortCode}`);
      return res.status(404).json({ message: "Short url not found" });
    }

    const { long_url, expires_at, click_count, id } = result.rows[0];

    if (expires_at && new Date() > new Date(expires_at)) {
      logDebug(`Short code expired: ${shortCode}`);
      return res
        .status(410)
        .json({ message: "This short Url link has expired" });
    }

    //Increment click count
    await pool.query(
      `
       UPDATE urls SET click_count = click_count + 1 WHERE short_code = $1
    `,
      [shortCode]
    );

    await pool.query(
      `INSERT INTO click_logs(url_id) VALUES($1) RETURNING clicked_at`,
      [id]
    );
    logInfo("Click stamp recorded");

    logInfo(`Redirecting to ${long_url} | Clicks: ${click_count + 1}`);

    //Redirect to the original URL
    return res.redirect(302, long_url);
  } catch (error) {
    logError(`Redirection failed for ${shortCode}: ${error.message}`);
    return res.status(500).json({
      message: "Failed to process short url",
      error: error.message,
    });
  }
};

export { getRedirectUrl };
