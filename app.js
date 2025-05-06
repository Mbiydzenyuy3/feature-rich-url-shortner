import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import { fileURLToPath } from "node:url";
import path, { dirname } from "node:path";

// import swaggerUi from "swagger-ui-express";
// import swaggerSpec from "./swaggerConfig.js";

import indexRouter from "./src/routes/index.js";
import authRouter from "./src/routes/user.js";

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
app.use("/auth", authRouter);

export default app;
