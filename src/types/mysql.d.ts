interface MySQLError extends Error {
	code: string;
	errno: number;
	sql: string;
	sqlState: string;
	sqlMessage: string;
}

interface Uploadable {
	fileName: string,
	localPath : string,
	remotePath : string,
	contentType :  'video/webm' | 'image/gif',
}
