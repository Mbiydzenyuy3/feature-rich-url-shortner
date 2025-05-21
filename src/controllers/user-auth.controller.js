import * as AuthService from "../services/user.service.js";
import { logDebug, logError, logInfo } from "../utils/logger.js";
import { generateOAuthState, verifyOAuthState } from "../utils/oauthState.js";
import { oauth2Client, scope } from "../utils/getGoogleAuth.js";
import jwt from "jsonwebtoken";
import { google } from "googleapis";

// Register Controller
export async function register(req, res, next) {
  const { username, email, password } = req.body;

  try {
    const result = await AuthService.registerUser({
      username,
      email,
      password,
    });
    res.status(201).json(result);
  } catch (err) {
    logError("❌ Error during registration:", err.message);
    next(err); // Error middleware handles it
  }
}

// Login Controller
export async function login(req, res, next) {
  const { email, password } = req.body;

  try {
    const result = await AuthService.loginUser({ email, password });
    logInfo("✅ User logged in:", result.data.email);
    res.status(200).json(result);
  } catch (err) {
    logError("❌ Error logging in user:", err.message);
    next(err);
  }
}

// Logout Controller (informational)
export function logoutUser(req, res) {
  const userId = req.user?.id || "Unknown";
  logInfo(`Logout requested for user ID: ${userId}`);
  res.json({ message: "Logout successful. Please discard your token." });
}

//Redirect user to Google's OAuth 2.0 server
export const googleAuthCallback = async (req, res) => {
  const { code, state } = req.query;

  // Verify OAuth state token
  const stateValid = verifyOAuthState(state);
  if (!stateValid) {
    logDebug("OAuth state mismatch or expired");
    return res.status(400).send("Invalid or expired OAuth state");
  }

  try {
    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Fetch user info from Google
    const oauth2 = google.oauth2({ auth: oauth2Client, version: "v2" });
    const { data: userInfo } = await oauth2.userinfo.get();

    const googleId = userInfo.id;
    const email = userInfo.email;
    const name = userInfo.name || "Google User";

    // Ensure user exists in DB
    const existingUser = await query(
      "SELECT id FROM users WHERE id = $1 LIMIT 1",
      [googleId]
    );

    if (existingUser.rowCount === 0) {
      await query(
        "INSERT INTO users (id, email, username) VALUES ($1, $2, $3)",
        [googleId, email, name]
      );
      logInfo(`👤 New Google user created: ${email}`);
    } else {
      logInfo(`👤 Existing Google user logged in: ${email}`);
    }

    // Create JWT payload
    const jwtPayload = {
      id: googleId,
      email,
      name,
    };

    // Sign JWT
    const jwtToken = jwt.sign(jwtPayload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "5h",
    });

    logInfo("✅ Google Auth Success:", userInfo);

    // Redirect to frontend with token
    const frontendRedirect = `${process.env.FRONTEND_URL}/oauth/callback?token=${jwtToken}`;
    return res.redirect(frontendRedirect);
  } catch (error) {
    logError("OAuth callback error:", error);
    return res.status(500).send("OAuth callback failed.");
  }
};
