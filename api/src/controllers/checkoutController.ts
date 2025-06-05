import { Request, Response } from "express";
import { createOrder } from "../models/orderModel";
import { AuthRequest } from "../middlewares/authMiddleware";

export const checkout = async (req: AuthRequest, res: Response): Promise<void> => {
	const { cartId } = req.body;

	if (!cartId || !req.user) {
		res.status(400).json({ error: "Missing cartId or not authenticated." });
		return;
	}

	try {
		const orderId = await createOrder(req.user.userId, cartId);
		res.status(201).json({ message: `Order ${orderId} placed successfully.` });
	} catch (err) {
		console.error("Checkout error:", err);
		res.status(500).json({ error: "Checkout failed." });
	}
};