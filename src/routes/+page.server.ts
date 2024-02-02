import { pool } from '$lib/database/db.js';
import { SQL_Statements } from '$lib/database/sql_queries.js';

export async function load() {
	const connection = await pool.getConnection();
	const sql = SQL_Statements.gallery;	
	const [results] = await connection.query(sql);
    const images = Array.isArray(results) ? results.map(element => element) : [];
	connection.release();
	return { images: images };
}
