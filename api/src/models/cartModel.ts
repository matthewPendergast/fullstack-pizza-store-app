import { pool } from "../config/db";

export interface CartItem {
	id: number;
	cart_id: string;
	menu_item_id: number;
	quantity: number;
	created_at: Date;
	item_name: string;
	item_price: number;
	item_category: string;
}

export const getCartById = async (cartId: string): Promise<CartItem[]> => {
	const result = await pool.query(
        `
        SELECT ci.*, mi.name AS item_name, mi.price AS item_price, mi.category AS item_category
        FROM cart_items ci
        JOIN menu_items mi ON ci.menu_item_id = mi.id
        WHERE ci.cart_id = $1
        ORDER BY ci.created_at ASC
        `,
        [cartId]
    );
    return result.rows;
};

export const addToCart = async (
    cartId: string,
    menuItemId: number,
    quantity: number
): Promise<void> => {
    await pool.query(
        `
        INSERT INTO cart_items (cart_id, menu_item_id, quantity)
        VALUES ($1, $2, $3)
        ON CONFLICT (cart_id, menu_item_id)
        DO UPDATE SET quantity = cart_items.quantity + $3
        `,
        [cartId, menuItemId, quantity]
    );
};

export const updateCartItemQuantity = async (
	cartId: string,
	menuItemId: number,
	quantity: number
): Promise<void> => {
	await pool.query(
        `
        UPDATE cart_items
        SET quantity = $3
        WHERE cart_id = $1 AND menu_item_id = $2
        `,
        [cartId, menuItemId, quantity]
    );
};

export const removeFromCart = async (
    cartId: string,
    menuItemId: number
): Promise<void> => {
    await pool.query(
        `
        DELETE FROM cart_items
        WHERE cart_id = $1 AND menu_item_id = $2
        `,
        [cartId, menuItemId]
    );
};
