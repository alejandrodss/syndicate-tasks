import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import crypto from 'crypto';

const s3Client = new S3Client({});
const bucketName = process.env.bucket_name;

export const handler = async (event) => {
    const uuids = [];
    for(let i= 0; i < 10; i++ ){
        uuids.push(crypto.randomUUID());
    }
    const fileContent = JSON.stringify({
        ids: uuids
    });

    console.log(fileContent);

    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: (new Date()).toISOString(),
        Body: fileContent,
    });

    try {
        const response = await s3Client.send(command);
        console.log("Upload success", response);
    } catch(err) {
        console.log('There was an error: ', err.message);
    }
};
