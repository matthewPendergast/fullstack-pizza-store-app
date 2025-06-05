import express from "express";
import { signup, login } from "../controllers/authController";
import { authRateLimiter } from "../middlewares/rateLimiter";
import { validateSignup, validateLogin } from "../middlewares/validate";

const router = express.Router();

router.post("/signup", authRateLimiter, ...validateSignup, signup);
router.post("/login", authRateLimiter, ...validateLogin, login);

export default router;
