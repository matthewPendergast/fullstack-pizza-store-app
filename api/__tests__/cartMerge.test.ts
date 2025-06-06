import request from "supertest";
import { pool } from "../src/config/db";
import { randomUUID } from "crypto";
import { mergeCartItems } from "../src/models/cartModel";
import { createTestApp } from "./testUtils";

const app = createTestApp();

describe("Cart merge behavior (API + direct model)", () => {
	const anonCartId = randomUUID();
	const email = `merge-${Date.now()}@example.com`;
	const password = "test123";
	let userId: number;

	beforeAll(async () => {
		// Create new test user
		const signupRes = await request(app).post("/auth/signup").send({
			name: "Merge Test User",
			email,
			password,
		});
		expect(signupRes.statusCode).toBe(201);
		userId = signupRes.body.user.id;

		// Add item to anonymous cart, pre-login
		await pool.query(
			`
			INSERT INTO cart_items (cart_id, menu_item_id, quantity)
			VALUES ($1, 1, 2)
			`,
			[anonCartId]
		);
	});

	it("should merge cart via direct function call", async () => {
		// Ensure test user cart is empty
		await pool.query("DELETE FROM cart_items WHERE user_id IS NOT NULL");

		await mergeCartItems(userId, anonCartId);

		// Query updated cart states
		const userCart = await pool.query(
			`SELECT * FROM cart_items WHERE user_id = $1`,
			[userId]
		);
		const leftoverAnonCart = await pool.query(
			`SELECT * FROM cart_items WHERE cart_id = $1`,
			[anonCartId]
		);

		// Ensure user cart contains expected merge item
		expect(userCart.rows.length).toBe(1);
		expect(userCart.rows[0]).toMatchObject({
			menu_item_id: 1,
			quantity: 2,
		});

		// Ensure anonymous cart is cleared after merge
		expect(leftoverAnonCart.rows.length).toBe(0);
	});

	it("should merge cart via login API", async () => {
		// Ensure test user cart is empty
		await pool.query("DELETE FROM cart_items");

		// Add item to anonymous cart, pre-login
		await pool.query(
			`
			INSERT INTO cart_items (cart_id, menu_item_id, quantity)
			VALUES ($1, 1, 2)
			`,
			[anonCartId]
		);

		const loginRes = await request(app).post("/auth/login").send({
			email,
			password,
			cartId: anonCartId,
		});
		expect(loginRes.statusCode).toBe(200);

		// Query updated cart states
		const userCart = await pool.query(
			`SELECT * FROM cart_items WHERE user_id = $1`,
			[userId]
		);
		const anonCart = await pool.query(
			`SELECT * FROM cart_items WHERE cart_id = $1`,
			[anonCartId]
		);

		// Ensure user cart contains expected merge item
		expect(userCart.rows.length).toBe(1);
		expect(userCart.rows[0]).toMatchObject({
			menu_item_id: 1,
			quantity: 2,
		});
		expect(anonCart.rows.length).toBe(0);
	});

	it("should sum quantities if same item exists in both anon and user cart", async () => {
		// Reset all user/cart data for a clean test
		await pool.query("TRUNCATE users, cart_items RESTART IDENTITY CASCADE");

		const anonCartId = randomUUID();
		const userCartQty = 3;
		const anonCartQty = 2;

		// Create a new user
		const signupRes = await request(app).post("/auth/signup").send({
			name: "Conflict Merge Test",
			email: "conflict@example.com",
			password: "123456",
		});
		const userId = signupRes.body.user.id;

		// Add same item to both user cart and anon cart
		await pool.query(
			`
			INSERT INTO cart_items (user_id, menu_item_id, quantity)
			VALUES ($1, 1, $2)
			`,
			[userId, userCartQty]
		);
		await pool.query(
			`
			INSERT INTO cart_items (cart_id, menu_item_id, quantity)
			VALUES ($1, 1, $2)
			`,
			[anonCartId, anonCartQty]
		);

		// Login and trigger merge
		const loginRes = await request(app).post("/auth/login").send({
			email: "conflict@example.com",
			password: "123456",
			cartId: anonCartId,
		});
		expect(loginRes.statusCode).toBe(200);

		const userCart = await pool.query(
			`SELECT * FROM cart_items WHERE user_id = $1`,
			[userId]
		);

		// Expect quantity to be summed: 3 (existing) + 2 (anon) = 5
		expect(userCart.rows.length).toBe(1);
		expect(userCart.rows[0]).toMatchObject({
			menu_item_id: 1,
			quantity: (userCartQty + anonCartQty),
		});
	});
});
