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
export const googleAuthRedirect = (req, res) => {
  const state = generateOAuthState();

  //Generate a url that asks permissions
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope,
    response_type: "code",
    //Enable incremental authorization.
    include_granted_scopes: true,
    //include the state parameter to reduce of Cross-Site Request Forgery attacks
    state,
    prompt: "consent",
  });

  res.redirect(authUrl);
};

// Handle Google's OAuth callback
export const googleAuthCallback = async (req, res) => {
  const { code, state } = req.query;

  if (!state) {
    logDebug("OAuth callback missing state");
    return res.status(400).send("Missing OAuth state");
  }
  if (!code) {
    logDebug("OAuth callback missing code");
    return res.status(400).send("Missing OAuth code");
  }

  const decodedState = verifyOAuthState(state);
  if (!decodedState) {
    logDebug("OAuth state mismatch or expired");
    return res.status(400).send("Invalid or expired OAuth state");
  }

  // Create fresh oauth2Client instance
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_OAUTH_REDIRECT_URL
  );

  try {
    logDebug("Exchanging code for tokens...");
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ auth: oauth2Client, version: "v2" });
    const { data: userInfo } = await oauth2.userinfo.get();

    logInfo("Google user info:", userInfo);

    // Check DB user
    try {
      const existingUser = await query(
        "SELECT user_id FROM users WHERE user_id = $1 LIMIT 1",
        [userInfo.id]
      );
      if (existingUser.rowCount === 0) {
        await query(
          "INSERT INTO users (user_id, email, name) VALUES ($1, $2, $3)",
          [userInfo.id, userInfo.email, userInfo.name]
        );
      }
    } catch (dbErr) {
      logError("DB error:", dbErr);
      return res.status(500).send("Database error.");
    }

    const jwtPayload = {
      user_id: userInfo.user_id,
      email: userInfo.email,
      name: userInfo.name,
    };

    const jwtToken = jwt.sign(jwtPayload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "5h",
    });

    const frontendRedirect = `${process.env.FRONTEND_URL}/oauth/callback?token=${jwtToken}`;
    return res.redirect(frontendRedirect);
  } catch (error) {
    logError("OAuth callback error:", error);
    return res.status(500).send("OAuth callback failed.");
  }
};
