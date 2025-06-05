import { Request, Response } from "express";
import {
	getCartById,
	addToCart,
	updateCartItemQuantity,
	removeFromCart
} from "../models/cartModel";

export const getCart = async (req: Request, res: Response): Promise<void> => {
	try {
		const { cartId } = req.params;
		const items = await getCartById(cartId);
		res.status(200).json(items);
	} catch (err) {
		console.error("Error fetching cart:", err);
		res.status(500).json({ error: "Internal server error." });
	}
};

export const addCartItem = async (req: Request, res: Response): Promise<void> => {
	const { cartId, menuItemId, quantity } = req.body;

	if (!cartId || !menuItemId || !quantity) {
		res.status(400).json({ error: "cartId, menuItemId, and quantity are required." });
		return;
	}

	try {
		await addToCart(cartId, menuItemId, quantity);
		res.status(201).json({ message: "Item added to cart." });
	} catch (err) {
		console.error("Error adding to cart:", err);
		res.status(500).json({ error: "Internal server error." });
	}
};

export const updateCartItem = async (req: Request, res: Response): Promise<void> => {
    const { cartId, menuItemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || Number(quantity) <= 0) {
        res.status(400).json({ error: "Quantity must be a positive number." });
        return;
    }

    try {
        await updateCartItemQuantity(cartId, parseInt(menuItemId), quantity);
        res.status(200).json({ message: "Cart item updated." });
    } catch (err) {
        console.error("Error updating cart item:", err);
        res.status(500).json({ error: "Internal server error." });
    }
};

export const deleteCartItem = async (req: Request, res: Response): Promise<void> => {
    const { cartId, menuItemId } = req.params;

    try {
        await removeFromCart(cartId, parseInt(menuItemId));
        res.status(200).json({ message: "Cart item removed." });
    } catch (err) {
        console.error("Error removing cart item:", err);
        res.status(500).json({ error: "Internal server error." });
    }
};