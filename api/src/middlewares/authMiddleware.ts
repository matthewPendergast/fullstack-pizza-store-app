import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not set in the environment variables.");
}

export interface AuthRequest extends Request {
	user?: { userId: number };
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		res.status(401).json({ error: "Authorization header missing or invalid." });
		return;
	}

	const token = authHeader.split(" ")[1];

	try {
		const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
		req.user = { userId: decoded.userId };
		next();
	} catch (err) {
		res.status(401).json({ error: "Invalid or expired token." });
	}
};