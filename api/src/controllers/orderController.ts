import { Request, Response } from "express";
import { getOrdersByUser } from "../models/orderModel";
import { AuthRequest } from "../middlewares/authMiddleware";

export const getUserOrders = async (req: AuthRequest, res: Response): Promise<void> => {
	try {
		const orders = await getOrdersByUser(req.user!.userId);
		res.status(200).json(orders);
	} catch (err) {
		console.error("Order fetch error:", err);
		res.status(500).json({ error: "Unable to fetch orders." });
	}
};