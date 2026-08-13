const { PutObjectCommand, Bucket } = require("@aws-sdk/client-s3");
const path = require("path");
const s3 = require("../config/s3");
const crypto = require("crypto");

const uploadTos3 = async (file) => {
    const fileName =
        `profile/${Date.now()}-${crypto.randomUUID()}${path.extname(file.originalname)}`;

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype
    };

    await s3.send(new PutObjectCommand(params));
    // const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    // return { url: imageUrl, key: fileName };
    return { key: fileName };

}
module.exports = uploadTos3;