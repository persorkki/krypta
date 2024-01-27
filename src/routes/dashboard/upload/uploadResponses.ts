
export const ResponseStatus = {
	NO_FILE: {
		message: 'No file provided or the provided entity is not a valid file.',
		status: 400,
		statusText: 'Bad Request'
	},
	INVALID_FILE: {
		message: 'File is not a valid .gif file',
		status: 415,
		statusText: 'Unsupported Media Type'
	},
	FILE_TOO_BIG: {
		message: `File size is over the maximum size limit`,
		status: 413,
		statusText: 'Content Too Large'
	},
	DUPLICATE_ENTRY: {
		message: `File already exists on the server!`,
		status: 409,
		statusText: 'Conflict'
	},
	UNKNOWN_ERROR: {
		message: `Unknown error occurred, unable to complete upload`,
		status: 500,
		statusText: 'Internal Server Error'
	},
	SUCCESS: {
		message: 'File uploaded successfully',
		status: 200,
		statusText: 'OK'
	}
};