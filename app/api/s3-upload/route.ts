import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
	region: process.env.NEXT_PUBLIC_AWS_REGION,
	credentials: {
		accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID as string,
		secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY as string,
	}
});

async function uploadFileToS3(file: Buffer, fileName: string): Promise<string> {
	const params = {
		Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME as string,
		Key: `question/${fileName}`,
		Body: file,
		ContentType: "image/jpg"
	};

	const command = new PutObjectCommand(params);
	await s3Client.send(command);
	return fileName;
}

export async function POST(request: Request): Promise<NextResponse> {
	try {
		const formData = await request.formData();
		const file = formData.get("file") as File | null;

		if (!file) {
			return NextResponse.json({ error: "File is required." }, { status: 400 });
		}

		const buffer = Buffer.from(await file.arrayBuffer());
		const fileName = await uploadFileToS3(buffer, file.name);

		return NextResponse.json({ success: true, fileName });
	} catch (error: unknown) {
		console.error("Error uploading file:", error);
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json({ error: "An error occurred." }, { status: 500 });
	}
}