import request from "supertest";
import { randomUUID } from "crypto";
import { createTestApp } from "./testUtils";

const app = createTestApp();

const TEST_CART_ID = randomUUID();
const TEST_EMAIL = `test-${Date.now()}@example.com`;

describe("Checkout flow", () => {
	let token: string;

	beforeAll(async () => {
		// Create user
		const signupRes = await request(app).post("/auth/signup").send({
			name: "Test User",
			email: TEST_EMAIL,
			password: "password123",
		});
		expect(signupRes.statusCode).toBe(201);


		// Login to get JWT token
		const loginRes = await request(app).post("/auth/login").send({
			email: TEST_EMAIL,
			password: "password123",
		});

		token = loginRes.body.token;

		if (!token) {
			throw new Error("Failed to retrieve token during test setup");
		}

		// Add item to cart
		await request(app).post("/cart").send({
			cartId: TEST_CART_ID,
			menuItemId: 1,
			quantity: 2,
		});
	});

	it("should successfully checkout with a valid token", async () => {
		const res = await request(app)
			.post("/checkout")
			.set("Authorization", `Bearer ${token}`)
			.send({ cartId: TEST_CART_ID });

		expect(res.statusCode).toBe(201);
		expect(res.body.message).toMatch(/Order \d+ placed successfully/);
	});

	it("should return the user's orders", async () => {
		const res = await request(app)
			.get("/orders")
			.set("Authorization", `Bearer ${token}`);

		expect(res.statusCode).toBe(200);
		expect(Array.isArray(res.body)).toBe(true);
		expect(res.body.length).toBeGreaterThan(0);

		const order = res.body[0];
		expect(order).toHaveProperty("id");
		expect(order).toHaveProperty("items");
		expect(Array.isArray(order.items)).toBe(true);

		const item = order.items[0];
		expect(item).toHaveProperty("menu_item_id");
		expect(item).toHaveProperty("quantity");
		expect(item).toHaveProperty("price");
	});
});
