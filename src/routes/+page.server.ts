import mysql from 'mysql2/promise';

import { DATABASE_URL } from '$env/static/private';

export async function load({ params }) {
	const connection = await mysql.createConnection(DATABASE_URL);
	const sql = 'SELECT * FROM images';
	const [results, fields] = await connection.execute(sql);
    const images = Array.isArray(results) ? results.map(element => element) : [];
	/*
    const data = {images: [
        "https://storage.googleapis.com/kryptayank/optimized/1704375717147490.gif",
        "https://storage.googleapis.com/kryptayank/optimized/1700924069302734.gif"
    ]}
    */

	return { images: images}
}
