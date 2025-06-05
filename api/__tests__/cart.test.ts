import request from "supertest";
import { pool } from "../src/config/db";
import { randomUUID } from "crypto";
import { createTestApp } from "./testUtils";

const app = createTestApp();
const TEST_CART_ID = randomUUID();

beforeEach(async () => {
	await pool.query("DELETE FROM cart_items");
});

describe("POST /cart", () => {
	it("should add an item to the cart", async () => {
		const res = await request(app)
			.post("/cart")
			.send({
				cartId: TEST_CART_ID,
				menuItemId: 1,
				quantity: 2,
			});

		expect(res.statusCode).toBe(201);
		expect(res.body).toHaveProperty("message", "Item added to cart.");
	});

	it("should return 400 if fields are missing", async () => {
		const res = await request(app).post("/cart").send({
			cartId: TEST_CART_ID,
			quantity: 1,
		});

		expect(res.statusCode).toBe(400);
		expect(res.body).toHaveProperty("error");
	});

	it("should increase quantity if item already exists", async () => {
		await request(app).post("/cart").send({
			cartId: TEST_CART_ID,
			menuItemId: 1,
			quantity: 1,
		});

		await request(app).post("/cart").send({
			cartId: TEST_CART_ID,
			menuItemId: 1,
			quantity: 2,
		});

		const res = await request(app).get(`/cart/${TEST_CART_ID}`);
		expect(res.statusCode).toBe(200);
		expect(res.body[0].quantity).toBe(3);
	});

});

describe("GET /cart/:cartId", () => {
	beforeEach(async () => {
		await pool.query("DELETE FROM cart_items");

		await request(app).post("/cart").send({
			cartId: TEST_CART_ID,
			menuItemId: 1,
			quantity: 2,
		});
	});

	it("should return cart items for the given cartId", async () => {
		const res = await request(app).get(`/cart/${TEST_CART_ID}`);

		expect(res.statusCode).toBe(200);
		expect(Array.isArray(res.body)).toBe(true);
		expect(res.body.length).toBeGreaterThan(0);

		const item = res.body[0];
		expect(item).toHaveProperty("cart_id", TEST_CART_ID);
		expect(item).toHaveProperty("quantity", 2);
		expect(item).toHaveProperty("item_name");
		expect(item).toHaveProperty("item_price");
		expect(item).toHaveProperty("item_category");
	});

	it("should return empty array for cartId with no items", async () => {
		const EMPTY_CART_ID = "00000000-0000-0000-0000-000000000000";
		const res = await request(app).get(`/cart/${EMPTY_CART_ID}`);

		expect(res.statusCode).toBe(200);
		expect(Array.isArray(res.body)).toBe(true);
		expect(res.body.length).toBe(0);
	});
});
