interface MySQLError extends Error {
	code: string;
	errno: number;
	sql: string;
	sqlState: string;
	sqlMessage: string;
}
