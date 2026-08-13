const { GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const s3 = require("../config/s3");

const generateSignedUrl = async (key) => {
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key
    }
    const command = new GetObjectCommand(params);
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 1 * 60 * 60 });
    return signedUrl;
}

module.exports = generateSignedUrl;