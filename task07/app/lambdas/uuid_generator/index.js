const AWS = require('aws-sdk');
const crypto = require('crypto');

const s3Client = new AWS.S3();
const bucketName = process.env.target_bucket

exports.handler = async (event) => {
    const uuids = [];
    for(let i= 0; i < 10; i++ ){
        uuids.push(crypto.randomUUID());
    }
    const fileContent = JSON.stringify({
        ids: uuids
    });

    console.log(fileContent);

    const uploadParams = {
        Bucket: bucketName,
        Key: (new Date()).toISOString(),
        Body: Buffer.from(fileContent, 'utf8'),
        ContentType: 'text/plain'
    };

    s3Client.upload(uploadParams, function(err, data) {
        if(err) {
            console.log('There was an error: ', err.message);
        }
        if(data) {
            console.log("Upload success", data.Location);
        }
    });
};
