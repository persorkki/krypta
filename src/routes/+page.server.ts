//import { DATABASE_URL } from '$env/static/private';
//import mysql from 'mysql2/promise';
import { SQL_Statements } from '$lib/database/sql_queries.js';

export async function load({ locals }) {
	
	const connection = locals.db;

	const sql = SQL_Statements.gallery;

	
	const [results, fields] = await connection.query(sql);
	
    const images = Array.isArray(results) ? results.map(element => element) : [];

	return { images: images };
}
