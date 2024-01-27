// sveltekit
import { json, type RequestHandler } from '@sveltejs/kit';

// nodejs
import path from 'path';
import crypto from 'crypto';
import { Readable } from 'stream';
import stream from 'stream/promises';

// 3rd party
import sharp from 'sharp';
import sanitize from 'sanitize-filename';
import { Storage } from '@google-cloud/storage';

// .env
import { SERVICE_ACCOUNT_JSON_PATH, GIF_BUCKET_NAME } from '$env/static/private';

import { PUBLIC_FILE_SIZE_LIMIT } from '$env/static/public';

// db
import { SQL_Upload } from '$lib/database/sql_queries';

const MAX_FILESIZE = parseInt(PUBLIC_FILE_SIZE_LIMIT);

import { ResponseStatus } from './uploadResponses';

/**
 * looks for GIF signatures in the first bytes of the binary content.
 * returns true if a GIF signature is found; otherwise false
 */
function validateSignature(signature: ArrayBuffer) {
	const signature_slice = Buffer.from(signature.slice(0, 6));
	// hardcoded magic signatures, sry. these signatures are: "GIF87a" and "GIF89a"
	const GIF87a_SIG = Buffer.from([0x47, 0x49, 0x46, 0x38, 0x37, 0x61]);
	const GIF89a_SIG = Buffer.from([0x47, 0x49, 0x46, 0x38, 0x39, 0x61]);

	return (signature_slice.equals(GIF87a_SIG) || signature_slice.equals(GIF89a_SIG))
}

function validateGifAttributes(file: File): boolean {
	return file.type == 'image/gif' && path.extname(file.name) == '.gif';
}

function onlyChangeFileExt(srcFilename: string, outputType: string) {
	const inputFilename = path.basename(srcFilename, path.extname(srcFilename));

	return inputFilename + outputType;
}

function getHash(buffer: Buffer): string {
	const hash = crypto.createHash('md5');
	hash.update(buffer);
	return hash.digest('hex');
}

export const POST: RequestHandler = async ({ request, locals }) => {
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

	const sharpFile = sharp(arrayBuffer, { animated: true });
	const gif = await sharpFile.gif().toBuffer();

	// ------------------------------------------------------------
	// Database Operations
	// ------------------------------------------------------------

	try {
		const sqlValues = [
			`https://storage.googleapis.com/${GIF_BUCKET_NAME}/${outputFilename}`, // original_file_url
			`https://storage.googleapis.com/${GIF_BUCKET_NAME}/${outputFilename}`, // compressed_file_url
			getHash(gif) // md5hash
		];

		const connection = locals.db; // TODO: needs a type
		const sql = SQL_Upload;

		const [result] = await connection.query(sql, sqlValues);
		
	} catch (err) {
		const sqlError = err as MySQLError;
		let returnError = ResponseStatus.UNKNOWN_ERROR;

		// duplicate entry error
		if (sqlError.errno === 1062) {
			returnError = ResponseStatus.DUPLICATE_ENTRY;
		}

		// TODO: add error logging

		return json(returnError);
	}

	// ------------------------------------------------------------
	// Cloud Storage Operations
	// ------------------------------------------------------------

	try {
		const storage = new Storage({ keyFilename: SERVICE_ACCOUNT_JSON_PATH });
		const blob = storage.bucket(GIF_BUCKET_NAME).file(outputFilename);
		const blobStream = blob.createWriteStream({
			metadata: {
				contentType: 'image/gif'
			}
		});
		await stream.pipeline(Readable.from(gif), blobStream);
	} catch (err) {
		//TODO: add error interface
		return json(ResponseStatus.UNKNOWN_ERROR); // TODO: cloud upload error
	}

	return json(ResponseStatus.SUCCESS);
};
