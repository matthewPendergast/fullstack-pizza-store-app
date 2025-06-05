import { pool } from "./src/config/db";
import fs from "fs";
import path from "path";

export default async function globalSetup() {
	await pool.query("TRUNCATE users, orders, order_items, cart_items, menu_items RESTART IDENTITY CASCADE");

	const seedPath = path.join(__dirname, "./seed.sql");
	const seedSql = fs.readFileSync(seedPath, "utf-8");

	await pool.query(seedSql);
}
