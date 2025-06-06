import { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";

const isTestEnv = process.env.NODE_ENV === "test";

export const authRateLimiter = isTestEnv
	? (req: Request, res: Response, next: NextFunction) => next()
	: rateLimit({
		windowMs: 15 * 60 * 1000,
		max: 5,
		message: "Too many login/signup attempts. Please try again later.",
	});
