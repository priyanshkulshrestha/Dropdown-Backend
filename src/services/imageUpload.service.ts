const aws = require('aws-sdk');
const multer = require('multer');
// const sharp = require("sharp");
const path = require('path');
var Jimp = require('jimp');
require('dotenv').config();

aws.config.update({
    secretAccessKey: process.env.AmazonWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AmazonWS_ACCESS_KEY_ID,
    region: process.env.AmazonWS_REGION
});

const s3 = new aws.S3();
const storage = multer.memoryStorage();

const fileFilter = function(req: Request, file: any, cb: any) {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb("Error: Allow images only of extensions jpeg|jpg|png !");
    }
}

export const upload = multer({
    storage,
    fileFilter,
    limits: { 
        fileSize: 1024 * 1024 * 25 
    },
});


export const s3Upload = async (file: any, s3key: string) => {
    // const compressedBuffer = await sharp(file.buffer)
    // .resize(400, 400)
    // .webp({ quality: 40 })
    // .toBuffer();
    const compressedBuffer = await Jimp.read(Buffer.from(file.buffer, 'base64'))
    .then(async (image: any) => {
        image.resize(400, 400);
        image.quality(10);
        return image.getBufferAsync(Jimp.AUTO);
    })
    .catch((err: any) => {
        console.log(err)
    });
    return await s3.putObject({
        Bucket: process.env.AmazonWS_BUCKET_NAME,
        Key: s3key,
        Body: compressedBuffer,
        ContentType: 'image/jpeg'
    }).promise();
};