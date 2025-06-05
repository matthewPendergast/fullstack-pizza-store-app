import request from "supertest";
import { createTestApp } from "./testUtils";

const app = createTestApp();

describe("GET /menu", () => {
	it("should return a list of menu items", async () => {
		const res = await request(app).get("/menu");

		expect(res.statusCode).toBe(200);
		expect(Array.isArray(res.body)).toBe(true);
		expect(res.body.length).toBeGreaterThan(0);

		const item = res.body[0];
		expect(item).toHaveProperty("id");
		expect(item).toHaveProperty("name");
		expect(item).toHaveProperty("description");
		expect(item).toHaveProperty("price");
		expect(item).toHaveProperty("category");
	});
});
