export const SQL_Statements = {
	upload: 'INSERT INTO files (original_file_url, compressed_file_url, md5_hash) VALUES (?, ?, ?)',
	gallery: 'SELECT * FROM files',
};
