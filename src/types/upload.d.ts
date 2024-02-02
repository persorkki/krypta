interface fileObject {
	fileName: string;
	localPath: string;
	remotePath: string;
	contentType: 'image/gif' | 'video/webm';
}

interface JsonResponse {
	message: string;
	status: number;
	statusText: string;
}

interface Responses {
	success: {
		OK: (url: string) => {};
	};
	reject: {
		UnsupportedMediaType: JsonResponse;
		BadRequest: JsonResponse;
		PayloadTooLarge: JsonResponse;
		ServiceUnavailable: JsonResponse;
		InternalServerError: JsonResponse;
		Conflict: JsonResponse;
		Unauthorized: JsonResponse;
	};
}