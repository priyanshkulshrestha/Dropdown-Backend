"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3Upload = exports.upload = void 0;
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
const fileFilter = function (req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    }
    else {
        cb("Error: Allow images only of extensions jpeg|jpg|png !");
    }
};
exports.upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 25
    },
});
const s3Upload = (file, s3key) => __awaiter(void 0, void 0, void 0, function* () {
    // const compressedBuffer = await sharp(file.buffer)
    // .resize(400, 400)
    // .webp({ quality: 40 })
    // .toBuffer();
    const compressedBuffer = yield Jimp.read(Buffer.from(file.buffer, 'base64'))
        .then((image) => __awaiter(void 0, void 0, void 0, function* () {
        image.resize(400, 400);
        image.quality(10);
        return image.getBufferAsync(Jimp.AUTO);
    }))
        .catch((err) => {
        console.log(err);
    });
    return yield s3.putObject({
        Bucket: process.env.AmazonWS_BUCKET_NAME,
        Key: s3key,
        Body: compressedBuffer,
        ContentType: 'image/jpeg'
    }).promise();
});
exports.s3Upload = s3Upload;
