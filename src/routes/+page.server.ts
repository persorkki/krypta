//import { DATABASE_URL } from '$env/static/private';
//import mysql from 'mysql2/promise';

export async function load({ locals }) {
	
	const connection = locals.db;

	const sql = 'SELECT * FROM files';

	
	const [results, fields] = await connection.query(sql);
	
    const images = Array.isArray(results) ? results.map(element => element) : [];

	return { images: images };
}
