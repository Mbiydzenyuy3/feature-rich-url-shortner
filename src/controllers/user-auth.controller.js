import bcrypt from "bcryptjs"; // For hashing passwords
import jwt from "jsonwebtoken"; // For generating JWTs
import * as AuthService from "../services/user.service.js";
import { logError, logInfo } from "../utils/logger.js";
import { pool } from "../config/db.js";

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "3h" }
  );
};

// ✅ User Registration
export async function register(req, res, next) {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields.",
    });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const existingUser = await client.query(
      "SELECT 1 FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rowCount > 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        success: false,
        message: "Email already in use by another user.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertResult = await client.query(
      `INSERT INTO users (username, email, password)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [username, email, hashedPassword]
    );

    const userId = insertResult.rows[0].id;

    await client.query("COMMIT");

    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      data: { id: userId, email, username },
    });
  } catch (err) {
    await client.query("ROLLBACK");
    logError("❌ Error during registration:", err);
    return next(err);
  } finally {
    client.release();
  }
}

// ✅ User Login
export async function login(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide both email and password.",
    });
  }

  try {
    const user = await AuthService.getUserByEmail(email);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials. Please check your email and password.",
      });
    }

    const token = generateToken(user);

    logInfo("User logged in", user.email);

    return res.status(200).json({
      success: true,
      message: "User logged in successfully.",
      token,
      data: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (err) {
    logError("❌ Error logging in user:", err);
    next(err);
  }
}

export async function logoutUser(req, res) {
  // In a stateless JWT system, logout is primarily handled client-side
  // by deleting the token.
  // This endpoint exists for convention and potential future use (e.g., blocklisting).
  const userId = req.user ? req.user.id : "Unknown (no token?)"; // Get user ID if authenticated
  logger.info(`Logout requested for user ID: ${userId}`);
  res.json({ message: "Logout successful. Please discard your token." });
}
