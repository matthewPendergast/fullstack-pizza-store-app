import request from "supertest";
import { createTestApp } from "./testUtils";

const app = createTestApp();
const TEST_SIGNUP_EMAIL = `test-signup-${Date.now()}@example.com`;
const TEST_LOGIN_EMAIL = `test-login-${Date.now()}@example.com`;

describe("POST /auth/signup", () => {
	it("should create a new user and return 201", async () => {
		const res = await request(app)
			.post("/auth/signup")
			.send({
				name: "Test User",
				email: TEST_SIGNUP_EMAIL,
				password: "password123",
			});

		expect(res.statusCode).toBe(201);
		expect(res.body.message).toBe("User created successfully.");
		expect(res.body.user).toHaveProperty("id");
		expect(res.body.user).toHaveProperty("name", "Test User");
		expect(res.body.user).toHaveProperty("email", TEST_SIGNUP_EMAIL);
	});

	it("should return 409 if email already exists", async () => {
		// First signup
		await request(app).post("/auth/signup").send({
			name: "Test User",
			email: TEST_SIGNUP_EMAIL,
			password: "password123",
		});

		// Try to sign up again with the same email
		const res = await request(app).post("/auth/signup").send({
			name: "Test User",
			email: TEST_SIGNUP_EMAIL,
			password: "password123",
		});

		expect(res.statusCode).toBe(409);
		expect(res.body).toHaveProperty("error", "Email is already in use.");
	});

	it("should return 400 if required fields are missing", async () => {
		const res = await request(app).post("/auth/signup").send({
			email: TEST_SIGNUP_EMAIL,
		});

		expect(res.statusCode).toBe(400);
		expect(Array.isArray(res.body.errors)).toBe(true);
		expect(res.body.errors.length).toBeGreaterThan(0);
	});

	it("should return 400 for invalid signup input", async () => {
		const res = await request(app).post("/auth/signup").send({
			name: "",
			email: "invalid-email",
			password: "123",
		});
		expect(res.statusCode).toBe(400);
		expect(Array.isArray(res.body.errors)).toBe(true);
		expect(res.body.errors.length).toBeGreaterThan(0);
	});
});

describe("POST /auth/login", () => {
	beforeEach(async () => {
		await request(app).post("/auth/signup").send({
			name: "Test User",
			email: TEST_LOGIN_EMAIL,
			password: "securepass",
		});
	});

	it("should return 200 and a token for valid login", async () => {
		const res = await request(app).post("/auth/login").send({
			email: TEST_LOGIN_EMAIL,
			password: "securepass",
		});

		expect(res.statusCode).toBe(200);
		expect(res.body).toHaveProperty("token");
		expect(res.body).toHaveProperty("user");
		expect(res.body.user.email).toBe(TEST_LOGIN_EMAIL);
	});

	it("should return 401 for invalid password", async () => {
		const res = await request(app).post("/auth/login").send({
			email: TEST_LOGIN_EMAIL,
			password: "wrongpass",
		});

		expect(res.statusCode).toBe(401);
		expect(res.body).toHaveProperty("error", "Invalid credentials.");
	});

	it("should return 401 for non-existent email", async () => {
		const res = await request(app).post("/auth/login").send({
			email: "doesnotexist@example.com",
			password: "securepass",
		});

		expect(res.statusCode).toBe(401);
		expect(res.body).toHaveProperty("error", "Invalid credentials.");
	});

	it("should return 400 if fields are missing", async () => {
		const res = await request(app).post("/auth/login").send({
			email: TEST_LOGIN_EMAIL,
		});

		expect(res.statusCode).toBe(400);
		expect(Array.isArray(res.body.errors)).toBe(true);
		expect(res.body.errors.length).toBeGreaterThan(0);
	});
});
