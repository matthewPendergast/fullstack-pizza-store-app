import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByEmail, createUser } from "../models/userModel";
import { mergeCartItems } from "../models/cartModel";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not set in the environment variables.");
}

export const signup = async (req: Request, res: Response): Promise<void> => {
	const { name, email, password } = req.body;

	if (!name || !email || !password) {
        res.status(400).json({ error: "Name, email, and password are required." });
        return;
    }

    try {
        const existingUser = await findUserByEmail(email);

        if (existingUser) {
            res.status(409).json({ error: "Email is already in use." });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await createUser(name, email, hashedPassword);

        res.status(201).json({ message: "User created successfully.", user });
    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ error: "Internal server error." });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password, cartId } = req.body;

    if (!email || !password) {
        res.status(400).json({ error: "Email and password are required." });
        return;
    }

    try {
        const user = await findUserByEmail(email);
        if (!user) {
            res.status(401).json({ error: "Invalid credentials." });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.hashed_password);
        if (!isMatch) {
            res.status(401).json({ error: "Invalid credentials." });
            return;
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });

		if (cartId) {
			try {
				await mergeCartItems(user.id, cartId);
			} catch (err) {
				console.error("Error merging cart:", err);
			}
		}

        res.status(200).json({
            message: "Login successful.",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "Internal server error." });
    }
};