import express from "express";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

router.get("/", function (req, res) {
  res.send("Welcome to my Url shortener");
});

export default router;
