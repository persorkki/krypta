export const responses: Responses = {
	success: {
		OK: (url: string) => ({
			message: `Success`,
			status: 20,
			statusText: `OK`,
			url: url
		})
	},
	reject: {
		UnsupportedMediaType: {
			message: `Content-Type mismatch`,
			status: 415,
			statusText: `Unsupported Media Type`
		},
		BadRequest: {
			message: `Missing or invalid parameters, expected a file`,
			status: 400,
			statusText: `Bad Request`
		},
		PayloadTooLarge: {
			message: 'The file size exceeded the maximum limit',
			status: 413,
			statusText: 'Payload Too Large'
		},
		ServiceUnavailable: {
			message: 'Issue uploading cloud storage',
			status: 413,
			statusText: 'Service Unavailable'
		},
		InternalServerError: {
			message: 'Database error',
			status: 500,
			statusText: 'Internal Server Error'
		},
		Conflict: {
			message: 'Duplicate entry',
			status: 409,
			statusText: 'Conflict'
		},
		Unauthorized: {
			message: 'Authentication credentials were missing or incorrect',
			status: 401,
			statusText: 'Unauthorized'
		},
	}
};