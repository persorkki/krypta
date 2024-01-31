// sveltekit
import { json, type RequestHandler } from '@sveltejs/kit';

// nodejs
import path from 'path';
import crypto from 'crypto';
import { Readable } from 'stream';
import { writeFile } from 'fs/promises';
import stream from 'stream/promises';
import { unlink } from 'fs';

// 3rd party
import sharp from 'sharp';
import sanitize from 'sanitize-filename';
import { Storage } from '@google-cloud/storage';
import ffmpeg from 'fluent-ffmpeg';

// .env
import { SERVICE_ACCOUNT_JSON_PATH, GIF_BUCKET_NAME } from '$env/static/private';

import { PUBLIC_FILE_SIZE_LIMIT } from '$env/static/public';

// db
import { SQL_Statements } from '$lib/database/sql_queries';

const MAX_FILESIZE = parseInt(PUBLIC_FILE_SIZE_LIMIT);

import { ResponseStatus } from './uploadResponses';
import { readFileSync } from 'fs';


/**
 * looks for GIF signatures in the first bytes of the binary content.
 * returns true if a GIF signature is found; otherwise false
 */
function validateSignature(signature: ArrayBuffer) {
	const signature_slice = Buffer.from(signature.slice(0, 6));
	// hardcoded magic signatures, sry. these signatures are: "GIF87a" and "GIF89a"
	const GIF87a_SIG = Buffer.from([0x47, 0x49, 0x46, 0x38, 0x37, 0x61]);
	const GIF89a_SIG = Buffer.from([0x47, 0x49, 0x46, 0x38, 0x39, 0x61]);

	return signature_slice.equals(GIF87a_SIG) || signature_slice.equals(GIF89a_SIG);
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

async function removeTmpFiles(tmpFiles: Uploadable[]) {
	try {
	tmpFiles.forEach(file => {
		unlink(file.localPath, (err) => {
			if (err) throw `unable to remove file ${file.fileName}`;
			console.log(`file ${file.fileName} deleted successfully`);
		})
	});
	}
	catch(err) {
		console.log(err); //TODO: should be logged
	}
}

async function bucketUpload(buffer: Buffer, fileName: string, contentType: string) {
	try {
		const storage = new Storage({ keyFilename: SERVICE_ACCOUNT_JSON_PATH });

		const blob = storage.bucket(GIF_BUCKET_NAME).file(fileName);
		const blobStream = blob.createWriteStream({
			metadata: {
				contentType: contentType
			}
		});
		await stream.pipeline(Readable.from(buffer), blobStream);
		return true;
	} catch (err) {
		//TODO: add error interface
		return false;
		//return json(ResponseStatus.UNKNOWN_ERROR); // TODO: cloud upload error
	}
}

export const POST: RequestHandler = async ({ request, locals }) => {

	// ------------------------------------------------------------
	// basic file validation
	// ------------------------------------------------------------

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

	// ------------------------------------------------------------
	// ffmpeg & sharp
	// ------------------------------------------------------------

	const srcFilename = sanitize(file.name);
	const outputFilename = onlyChangeFileExt(srcFilename, '.webm');

	const tempLocalFolder = 'tmp/';

	const src : Uploadable = {
		fileName: srcFilename,
		localPath: path.join(tempLocalFolder, srcFilename),
		remotePath: `https://storage.googleapis.com/${GIF_BUCKET_NAME}/${srcFilename}`,
		contentType: 'image/gif',
	}

	const thumb : Uploadable = {
		fileName: outputFilename,
		localPath: path.join(tempLocalFolder, outputFilename),
		remotePath: `https://storage.googleapis.com/${GIF_BUCKET_NAME}/${outputFilename}`,
		contentType: 'video/webm',
	}

	const tmpFiles = [src, thumb];

	await writeFile(src.localPath, Buffer.from(arrayBuffer));

	var cmd = ffmpeg(src.localPath);
	cmd
		.videoCodec('libvpx-vp9')
		//.outputOptions(['-b:v 0', '-crf 31'])
		//.outputOptions(['-c:v'])
		.save(thumb.localPath)
		.on('end', () => {
			console.log(`finished encoding ${thumb.fileName}`);
			bucketUpload(readFileSync(thumb.localPath), thumb.fileName, thumb.contentType);
		})
		.on('error', () => {
			console.log('ffmpeg encode error');
			json(ResponseStatus.UNKNOWN_ERROR); //TODO: error code
		})
		.run();

	const sharpFile = sharp(arrayBuffer, { animated: true });
	const gif = await sharpFile.gif().toBuffer();

	// ------------------------------------------------------------
	// Database Operations
	// ------------------------------------------------------------

	try {
		const sqlValues = [
			src.fileName,
			src.remotePath,
			thumb.remotePath,
			getHash(gif) // md5hash
		];

		const connection = locals.db; // TODO: needs a type
		const sql = SQL_Statements.upload;

		await connection.query(sql, sqlValues);

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
		await bucketUpload(gif, src.fileName, src.contentType);
	} catch (err) {
		return json(ResponseStatus.UNKNOWN_ERROR); // TODO: cloud upload error
	}

	await removeTmpFiles(tmpFiles);

	return json({
		message: 'File uploaded successfully',
		url: `https://storage.googleapis.com/${GIF_BUCKET_NAME}/${srcFilename}`,
		status: 200,
		statusText: 'OK'
	});
};
