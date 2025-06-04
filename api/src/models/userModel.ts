import { pool } from "../config/db";

export interface User {
	id: number;
	name: string;
	email: string;
	hashed_password: string;
	created_at: Date;
}

export const findUserByEmail = async (email: string): Promise<User | null> => {
	const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
	return result.rows[0] || null;
};

export const createUser = async (
	name: string,
	email: string,
	hashedPassword: string
): Promise<User> => {
	const result = await pool.query(
        `
        INSERT INTO users (name, email, hashed_password)
        VALUES ($1, $2, $3)
        RETURNING id, name, email, created_at
        `,
        [name, email, hashedPassword]
    );
    return result.rows[0];
};