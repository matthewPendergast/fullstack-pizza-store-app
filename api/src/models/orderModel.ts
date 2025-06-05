import { pool } from "../config/db";

export const createOrder = async (
	userId: number,
	cartId: string
): Promise<number> => {
	const client = await pool.connect();

	try {
		await client.query("BEGIN");

		// Fetch user's cart items
		const cartItemsRes = await client.query(
			`
			SELECT menu_item_id, quantity, mi.price
			FROM cart_items ci
			JOIN menu_items mi ON ci.menu_item_id = mi.id
			WHERE cart_id = $1
			`,
			[cartId]
		);

		const cartItems = cartItemsRes.rows;

		if (cartItems.length === 0) {
			throw new Error("Cart is empty.");
		}

		// Calculate total price of all items in cart
		const totalPrice = cartItems.reduce((sum, item) => {
			return sum + item.quantity * parseFloat(item.price);
		}, 0);

		// Insert a new order into the orders table and get the order's ID
		const orderRes = await client.query(
			`INSERT INTO orders (user_id, total_price) VALUES ($1, $2) RETURNING id`,
			[userId, totalPrice]
		);

		const orderId = orderRes.rows[0].id;

		// Insert each item from the cart into the order_items table
		for (const item of cartItems) {
			await client.query(
				`
				INSERT INTO order_items (order_id, menu_item_id, quantity, price_at_time)
				VALUES ($1, $2, $3, $4)
				`,
				[orderId, item.menu_item_id, item.quantity, item.price]
			);
		}

		// Clear the user's cart
		await client.query(`DELETE FROM cart_items WHERE cart_id = $1`, [cartId]);

		await client.query("COMMIT");
		return orderId;
	} catch (err) {
		await client.query("ROLLBACK");
		throw err;
	} finally {
		client.release();
	}
};

export const getOrdersByUser = async (userId: number) => {
	const result = await pool.query(
        `
        SELECT o.id, o.total_price, o.created_at,
               json_agg(json_build_object(
                   'menu_item_id', oi.menu_item_id,
                   'quantity', oi.quantity,
                   'price', oi.price_at_time
               )) AS items
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        WHERE o.user_id = $1
        GROUP BY o.id
        ORDER BY o.created_at DESC
        `,
        [userId]
	);
	return result.rows;
};