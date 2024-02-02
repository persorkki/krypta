// sveltekit
import { json, type RequestHandler } from '@sveltejs/kit';

// nodejs
import path from 'path';
import crypto from 'crypto';
import { readFile, unlink } from 'fs/promises';
import { Readable } from 'stream';

// 3rd party
import sanitize from 'sanitize-filename';
import ffmpeg from 'fluent-ffmpeg';
import sharp from 'sharp';
import mysql from 'mysql2/promise';

// services
import { upload, getRemotePath } from '$lib/services/storage';
import { responses } from './responses';

//.env public
import { PUBLIC_FILE_SIZE_LIMIT } from '$env/static/public';
import { SQL_Statements } from '$lib/database/sql_queries';

// db
import { pool } from '$lib/database/db';

function validateGifAttributes(file: File): boolean {
	return file.type === 'image/gif' && path.extname(file.name) === '.gif';
}
function validateSignature(signature: Buffer) {
	const slice = signature.subarray(0, 6);
	const GIF87a = Buffer.from('GIF87a', 'utf8');
	const GIF89a = Buffer.from('GIF89a', 'utf8');
	return slice.equals(GIF87a) || slice.equals(GIF89a);
}

function changeFileExt(srcFilename: string, ext: string) {
	const inputFilename = path.basename(srcFilename, path.extname(srcFilename));

	return inputFilename + ext;
}

async function processVideo(fileBuffer: Buffer, file: fileObject) {
	return new Promise((resolve, reject) => {
		try {
			ffmpeg(Readable.from(fileBuffer))
				.videoCodec('libvpx-vp9')
				.save(file.localPath)
				.on('end', () => {
					resolve(`Finished encoding ${file.fileName}`);
				})
				.on('error', () => {
					throw `Error while encoding with ffmpeg`;
				});
		} catch (err) {
			reject(err);
		}
	});
}

function getHash(buffer: Buffer): string {
	const hash = crypto.createHash('md5').update(buffer);
	return hash.digest('hex');
}

export const POST: RequestHandler = async ({ request, locals }) => {
	
	if (!await locals.auth())
	{
		return json(responses.reject.Unauthorized);
	}
	// ------------------------------------------------------------
	// request validation
	// ------------------------------------------------------------

	const contentType = request.headers.get('Content-Type');
	if (!contentType || !contentType.includes('multipart')) {
		return json(responses.reject.UnsupportedMediaType);
	}

	const formData = await request.formData();
	const file = formData.get('file');

	if (!file || !(file instanceof File)) {
		return json(responses.reject.BadRequest);
	}
	// ------------------------------------------------------------
	// file validation
	// ------------------------------------------------------------

	// this is only used in the two checks below, see next comment block
	const fileBufferTmp = Buffer.from(await file.arrayBuffer());

	if (file.size > parseInt(PUBLIC_FILE_SIZE_LIMIT)) {
		return json(responses.reject.PayloadTooLarge);
	}
	if (!validateGifAttributes(file) || !validateSignature(fileBufferTmp)) {
		return json(responses.reject.UnsupportedMediaType);
	}

	// we dont do this earlier because we want to do file validation checks
	// before we do anything CPU intensive,
	// therefore: fileBufferTmp->fileBuffer through sharp

	const fileBuffer = await sharp(fileBufferTmp, { animated: true }).gif().toBuffer();

	// TODO: remove magic string
	const tmpFolder = 'tmp';

	const srcFilename = sanitize(file.name);
	const srcLocalPath = path.join(tmpFolder, srcFilename);
	const srcRemotePath = getRemotePath(srcFilename);
	const srcHash = getHash(fileBuffer);

	const previewFilename = changeFileExt(srcFilename, '.webm');
	const previewLocalPath = path.join(tmpFolder, previewFilename);
	const previewRemotePath = getRemotePath(previewFilename);

	// if the filename deformed the URL somehow, reject
	if (!srcRemotePath || !previewRemotePath) {
		return json(responses.reject.BadRequest);
	}

	const srcFile: fileObject = {
		fileName: srcFilename,
		localPath: srcLocalPath,
		remotePath: srcRemotePath,
		contentType: 'image/gif'
	};
	const previewFile: fileObject = {
		fileName: previewFilename,
		localPath: previewLocalPath,
		remotePath: previewRemotePath,
		contentType: 'video/webm'
	};

	// ------------------------------------------------------------
	// ffmpeg & cloud storage upload
	// ------------------------------------------------------------

	try {
		const srcFileUpload = upload(srcFile, fileBuffer);
		await processVideo(fileBuffer, previewFile);
		const previewBuffer = await readFile(previewFile.localPath);
		const previewFileUpload = upload(previewFile, previewBuffer);

		await Promise.all([srcFileUpload, previewFileUpload])

	} catch (err) {
		console.log(err); //TODO: logging
		return json(responses.reject.ServiceUnavailable);
	} finally {
		try {
			// cleanup
			await unlink(previewFile.localPath);
		} catch (err) {
			// file doesn't exist, no need to remove it
		}
	}
	// ------------------------------------------------------------
	// database
	// ------------------------------------------------------------

	try {
		const conn: mysql.PoolConnection = await pool.getConnection();
		const sql = SQL_Statements.upload;
		await conn.query(sql, [srcFile.fileName, srcFile.remotePath, previewFile.remotePath, srcHash]);
		conn.release();
	} catch (err) {
		const sqlError = err as MySQLError;
		if (sqlError.errno === 1062) {
			return json(responses.reject.Conflict);
		}
		return json(responses.reject.InternalServerError);
	}

	return json(responses.success.OK(srcFile.remotePath));
};
