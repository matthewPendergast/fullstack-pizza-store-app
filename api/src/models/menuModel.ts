import { pool } from "../config/db";

export interface MenuItem {
	id: number;
	name: string;
	description: string;
	price: number;
	category: string;
	created_at: Date;
}

export const getAllMenuItems = async (): Promise<MenuItem[]> => {
	const result = await pool.query("SELECT * FROM menu_items ORDER BY created_at ASC");
	return result.rows;
};