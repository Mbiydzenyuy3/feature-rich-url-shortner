import express from "express";
import { getRedirectUrl } from "../controllers/redirecturl-controller.js";
// import authMiddleware from "../middlewares/user-auth.middleware.js";

const router = express.Router();

router.get("/:shortCode", getRedirectUrl);

export default router;
