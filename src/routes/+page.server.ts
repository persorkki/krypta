import mysql from 'mysql2/promise';

import { DATABASE_URL } from '$env/static/private';

export async function load({ params }) {
	/*
	const connection = await mysql.createConnection(DATABASE_URL);
	const sql = 'SELECT * FROM images';
	const [results, fields] = await connection.execute(sql);
    const images = Array.isArray(results) ? results.map(element => element) : [];
    */

	/*
	const images = [
		{ url: 'https://storage.googleapis.com/kryptayank/optimized/1704375717147490.gif' },
		{ url: 'https://storage.googleapis.com/kryptayank/optimized/1700924069302734.gif' }
	];
    */

	const images = [
		{ url: 'horppy.gif' },
		{ url: 'whocares.gif' },
		{ url: 'paddington.gif' },
		{ url: 'pasianssi.gif' },
		{ url: 'horppy.gif' },
		{ url: 'whocares.gif' },
		{ url: 'paddington.gif' },
		{ url: 'pepper.gif' },
		{ url: 'pepper.gif' },
		{ url: 'paddington.gif' },
		{ url: 'pepper.gif' },
		{ url: 'pasianssi.gif' },
		{ url: 'horppy.gif' },
		{ url: 'whocares.gif' },
		{ url: 'paddington.gif' },
		{ url: 'paddington.gif' },
		{ url: 'pepper.gif' },
		{ url: 'pasianssi.gif' },
		{ url: 'horppy.gif' },
		{ url: 'whocares.gif' },
		{ url: 'paddington.gif' },
		{ url: 'pepper.gif' },
		{ url: 'pepper.gif' },
		{ url: 'pasianssi.gif' },
		{ url: 'horppy.gif' },
		{ url: 'whocares.gif' },
		{ url: 'paddington.gif' },
		{ url: 'pepper.gif' },
		{ url: 'pasianssi.gif' }
	];

	return { images: images };
}
