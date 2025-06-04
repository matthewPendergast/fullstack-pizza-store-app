import { Request, Response } from "express";
import { getAllMenuItems } from "../models/menuModel";

export const getMenu = async (req: Request, res: Response): Promise<void> => {
	try {
		const items = await getAllMenuItems();
		res.status(200).json(items);
	} catch (err) {
		console.error("Error fetching menu items:", err);
		res.status(500).json({ error: "Internal server error." });
	}
};