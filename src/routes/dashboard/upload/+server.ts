import { json } from '@sveltejs/kit';
import { promises as fs } from 'fs';
import join from 'path';
import path from 'path';
import sharp from 'sharp';

const MAX_FILESIZE = 4000000;
/*
interface ResponseMessage {
	message: string
	status: number
	statusText: string
}
*/

const ReturnCodes = {
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
		message: `File size is over the maximum size limit ${MAX_FILESIZE / 1000000} MiB`,
		status: 413,
		statusText: 'Content Too Large'
	},
	SUCCESS: {
		message: 'File uploaded successfully',
		status: 200,
		statusText: 'OK'
	}
};

/**
 * looks for GIF signatures in the first bytes of the binary content.
 * returns true if a GIF signature is found; otherwise false
 */
function validateSignature(signature: ArrayBuffer) {
	const signature_slice = Buffer.from(signature.slice(0, 6));
	// hardcoded magic signatures, sry. these signatures are: "GIF87a" and "GIF89a"
	const GIF87a_SIG = Buffer.from([0x47, 0x49, 0x46, 0x38, 0x37, 0x61]);
	const GIF89a_SIG = Buffer.from([0x47, 0x49, 0x46, 0x38, 0x39, 0x61]);

	if (signature_slice.equals(GIF87a_SIG) || signature_slice.equals(GIF89a_SIG)) {
		return true;
	}
	return false;
}

function validateGifAttributes(file: File): boolean {
	return file.type == 'image/gif' && path.extname(file.name) == '.gif';
}

function changeFileExt(file: File, outputType: string) {
	const savePath = 'static/';
	const inputFilename = path.basename(file.name, path.extname(file.name));
	const outputFilename = inputFilename + outputType;

	return path.join(savePath, outputFilename);
}

export async function POST({ request }: { request: Request }): Promise<Response> {
	const contentType = request.headers.get('Content-Type');
	if (!contentType || !contentType.includes('multipart')) {
		return json(ReturnCodes.NO_FILE);
	}

	const formData = await request.formData();
	const file = formData.get('file');

	if (!file || !(file instanceof File)) {
		return json(ReturnCodes.NO_FILE);
	}

	const arrayBuffer = await file.arrayBuffer();

	if (!validateGifAttributes(file) || !validateSignature(arrayBuffer)) {
		return json(ReturnCodes.INVALID_FILE);
	}

	if (file.size > MAX_FILESIZE) {
		return json(ReturnCodes.FILE_TOO_BIG);
	}

	const outputFilePath = changeFileExt(file, '.webp');

	// TODO: here we should check if a file with this name already exists on the server
	// if we compare hashes we have to do it after re-encode which will be pretty bad for performance
	// should we save the src file hash to the database?

	const sharpFile = sharp(arrayBuffer, { animated: true });
	const processFile: Promise<Response> = new Promise((resolve, reject) => {
		sharpFile.webp({ quality: 50 }).toFile(outputFilePath, (err, info) => {
			if (err) {
				//console.log(err);
				console.debug(err);
				reject(json(ReturnCodes.INVALID_FILE));
			} else {
				//console.log(info);
				console.debug(info);
				resolve(json(ReturnCodes.SUCCESS));
			}
		});
	});


	return await processFile;
}