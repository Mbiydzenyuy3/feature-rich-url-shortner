import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import { fileURLToPath } from "node:url";
import path, { dirname } from "node:path";

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swaggerConfig.js";
import errorHandler from "./src/middlewares/errorHandler-middleware.js";

import indexRouter from "./src/routes/index.js";
import authRouter from "./src/routes/user.js";
import urlRouter from "./src/routes/url.js"
import redirectRouter from "./src/routes/redirect.js"

const app = express();

// Setup __dirname (since ES modules don't have it by default)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//API Routes
app.use("/", indexRouter);
app.use("/api/auth", authRouter);
app.use("/api", urlRouter)
app.use("/", redirectRouter);

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//error message if anything goes wrong
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler);

export default app;
