"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const reviewSchema = new Schema({
    influencerID: { type: String, required: true },
    clientID: { type: String, required: true },
    username: { type: String, required: true },
    influencerName: { type: String, required: true },
    clientName: { type: String, required: true },
    companyName: { type: String, required: true },
    brandLogo: { type: String, required: true },
    reviewDescription: { type: String, required: true },
    reviewRating: { type: String, required: true },
    reviewDate: { type: Number, default: (new Date()).getTime() }
});
const ReviewSchema = mongoose_1.default.models.review || mongoose_1.default.model('review', reviewSchema);
module.exports = ReviewSchema;
