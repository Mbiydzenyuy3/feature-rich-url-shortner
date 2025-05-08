import express from "express";
import { getRedirectUrl } from "../controllers/redirecturl-controller.js";

const router = express.Router();

router.get("/shortener/:shortCode", getRedirectUrl);

export default router