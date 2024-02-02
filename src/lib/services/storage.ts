// TODO: this is supposed to be a service so move this implementation (google) stuff outside later
import stream from 'stream/promises';
import { Readable } from 'stream';
import { Storage } from '@google-cloud/storage';

import { SERVICE_ACCOUNT_JSON_PATH } from '$env/static/private';

function validateURL(url: string): boolean {
	try {
		new URL(url);
		return true;
	} catch (err) {
		return false;
	}
}

/**
 *
 * @returns `string` if `srcFilename` creates a valid URL, null if not
 */
export function getRemotePath(srcFilename: string): string | null {
	const remotePath = `${cloudBaseURI}${encodeURIComponent(srcFilename)}`;

	if (!validateURL(remotePath)) {
		return null;
	}
	return remotePath;
}

export async function upload(file: fileObject, fileBuffer: Buffer) {
	return new Promise(async (resolve, reject) => {
		try {
			const storage = new Storage({ keyFilename: SERVICE_ACCOUNT_JSON_PATH });
			const blob = storage.bucket('kryptayank').file(file.fileName);

			const blobStream = blob.createWriteStream({
				metadata: {
					contentType: file.contentType
				}
			});
			await stream.pipeline(Readable.from(fileBuffer), blobStream);
            console.log("success");
            resolve("resolve success");
		} catch (err) {
            console.log("not success");
			reject("reject not success");
		}
	});
}

const cloudBaseURI = `https://storage.googleapis.com/kryptayank/`;
