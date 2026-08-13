const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("../config/s3");

const deleteFromS3 = async (key) => {
    if (!key) return;
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key
    }
    await s3.send(new DeleteObjectCommand(params))
}
module.exports = deleteFromS3;
