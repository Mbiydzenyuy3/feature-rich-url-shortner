import express from "express";
import { getRedirectUrl } from "../controllers/redirecturl-controller.js";

const router = express.Router();

router.get("/:shortCode", getRedirectUrl);

export default router;
