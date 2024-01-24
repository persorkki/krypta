// sveltekit
import { json } from '@sveltejs/kit';

// nodejs
import path from 'path';

// 3rd party
import sharp from 'sharp';
import sanitize from 'sanitize-filename';
import { Storage } from '@google-cloud/storage';

import mysql from 'mysql2';

// .env
import {
	SERVICE_ACCOUNT_JSON_PATH,
	GIF_BUCKET_NAME,
	OPTIMIZED_BUCKET_FOLDER,
	DATABASE_URL
} from '$env/static/private';

import { PUBLIC_FILE_SIZE_LIMIT } from '$env/static/public';

const MAX_FILESIZE = parseInt(PUBLIC_FILE_SIZE_LIMIT);

const ResponseStatus = {
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

function changeFileExt(srcFilename: string, outputType: string) {
	const savePath = 'static/';
	const inputFilename = path.basename(srcFilename, path.extname(srcFilename));
	const outputFilename = inputFilename + outputType;

	return path.join(savePath, outputFilename);
}

function onlyChangeFileExt(srcFilename: string, outputType: string) {
	const inputFilename = path.basename(srcFilename, path.extname(srcFilename));

	return inputFilename + outputType;
}

export async function POST({ request }: { request: Request }): Promise<Response> {
	const contentType = request.headers.get('Content-Type');
	if (!contentType || !contentType.includes('multipart')) {
		return json(ResponseStatus.NO_FILE);
	}

	const formData = await request.formData();
	const file = formData.get('file');

	if (!file || !(file instanceof File)) {
		return json(ResponseStatus.NO_FILE);
	}

	const arrayBuffer = await file.arrayBuffer();

	if (!validateGifAttributes(file) || !validateSignature(arrayBuffer)) {
		return json(ResponseStatus.INVALID_FILE);
	}

	if (file.size > MAX_FILESIZE) {
		return json(ResponseStatus.FILE_TOO_BIG);
	}

	const srcFilename = sanitize(file.name);
	//const outputFilePath = changeFileExt(srcFilename, '.webp');
	const outputFilename = onlyChangeFileExt(srcFilename, '.gif');

	// TODO: here we should check if a file with this name already exists on the server
	// if we compare hashes we have to do it after re-encode which will be pretty bad for performance
	// should we save the src file hash to the database?

	const sharpFile = sharp(arrayBuffer, { animated: true });

	const processFile: Promise<Response> = new Promise((resolve, reject) => {
		sharpFile.gif().toBuffer((err, data, info) => {
			if (err) {
				console.log(err);
				reject(json(ResponseStatus.INVALID_FILE));
			} else {
				try {
					const storage = new Storage({ keyFilename: SERVICE_ACCOUNT_JSON_PATH });
					const optimizedFilename = path.join(OPTIMIZED_BUCKET_FOLDER, outputFilename);
					const blob = storage.bucket(GIF_BUCKET_NAME).file(optimizedFilename);

					const blobStream = blob.createWriteStream({
						metadata: {
							contentType: 'image/gif'
						}
					});

					/* event listeners */
					blobStream.on('error', (err) => {
						console.log('error uploading stream: ' + err);
						reject(json(ResponseStatus.INVALID_FILE));
					});
					blobStream.on('finish', () => {
						console.log('upload to Google Cloud complete!');
					});

					blobStream.end(data);
					
					const cloud_url = `https://storage.googleapis.com/${GIF_BUCKET_NAME}/${optimizedFilename}`;

					const connection = mysql.createConnection(DATABASE_URL)
					const sql = "INSERT INTO images (url) VALUES (?)"

					connection.query(sql, [cloud_url], (error, results, fields) => {
						if (error) {
							console.log(error);
						}
						console.log(results)
					})
				


					resolve(json(ResponseStatus.SUCCESS));

				} catch (err) {
					console.log(`error uploading to Google Cloud: ${err}`);
				}
			}
		});
	});

	return await processFile;
}
