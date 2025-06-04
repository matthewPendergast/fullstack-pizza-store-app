import { pool } from "./db";

export async function checkDatabaseConnection() {
    try {
        const res = await pool.query("SELECT NOW()");
        console.log("[DB] Connected at", res.rows[0].now);
    } catch (err) {
        console.error("[DB] Connection error:", err);
        process.exit(1);
    }
}