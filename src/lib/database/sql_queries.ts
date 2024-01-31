export const SQL_Statements = {
	upload: 'INSERT INTO files (filename, original_file_url, compressed_file_url, md5_hash) VALUES (?, ?, ?, ?)',
	gallery: 'SELECT * FROM files',
};
