import { PUBLIC_R2_PUBLIC_URL } from '$env/static/public';
import {
	CLOUDFLARE_R2_ACCOUNT_ID,
	CLOUDFLARE_R2_ACCESS_KEY_ID,
	CLOUDFLARE_R2_SECRET_ACCESS_KEY,
} from '$env/static/private';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

const r2Client = new S3Client({
	region: 'auto',
	endpoint: `https://${CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: CLOUDFLARE_R2_ACCESS_KEY_ID,
		secretAccessKey: CLOUDFLARE_R2_SECRET_ACCESS_KEY,
	},
	requestChecksumCalculation: 'WHEN_REQUIRED',
});

// Videos land here first; moving them into the institution's OneDrive is a
// separate, periodic step (rclone), not part of the submission flow.
export async function uploadIslrVideo(file: File, contributorId: string): Promise<string> {
	const extension = file.name.split('.').pop() || 'webm';
	const fileName = `${contributorId}_${uuidv4()}.${extension}`;
	const filePath = `islr-dataset/${fileName}`;
	const buffer = new Uint8Array(await file.arrayBuffer());

	await r2Client.send(
		new PutObjectCommand({
			Bucket: 'dclgp',
			Key: filePath,
			Body: buffer,
			ContentType: file.type || 'video/mp4',
		})
	);

	return `${PUBLIC_R2_PUBLIC_URL}/${filePath}`;
}
