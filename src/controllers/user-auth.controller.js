//controller/auth-controller.js
import bcrypt from "bcryptjs"; // To hash and compare passwords securely
import jwt from "jsonwebtoken"; // To generate JWT tokens
import * as AuthService from "../services/user.service.js";
import { logError, logInfo } from "../utils/logger.js";
import { query } from "../config/db.js";

// Controller function for user registration
export async function register(req, res, next) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields.",
    });
  }

  const client = await query("BEGIN");

  try {
    const existingUser = await query("SELECT 1 FROM users WHERE email = $1", [
      email,
    ]);

    if (existingUser.rowCount > 0) {
      await query("ROLLBACK");
      return res.status(400).json({
        success: false,
        message: "Email already in use by another user.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userInsertResult = await query(
      `INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3)
       RETURNING user_id`,
      [name, email, hashedPassword]
    );

    const userId = userInsertResult.rows[0].id;

    await query("COMMIT");

    const token = jwt.sign(
      {
        id: userId,
        email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "3h" }
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      token,
      data: {
        id: userId,
        email,
      },
    });
  } catch (err) {
    await query("ROLLBACK");
    logError("❌ Error during registration:", err);
    next(err);
  }
}
// Controller function for user login
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

    const tokenPayload = {
      id: user.id,
      email: user.email,
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "3h",
    });

    logInfo("User logged in", user.email);

    return res.status(200).json({
      success: true,
      token: token,
      message: "User logged in successfully",
      data: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (err) {
    logError("Error logging in user", err);
    next(err);
  }
}
