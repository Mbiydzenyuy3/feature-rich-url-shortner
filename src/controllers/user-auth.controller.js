import * as AuthService from "../services/user.service.js";
import { logError, logInfo } from "../utils/logger.js";

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
