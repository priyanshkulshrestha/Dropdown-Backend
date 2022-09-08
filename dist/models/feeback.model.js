"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const feedbackSchema = new Schema({
    userType: { type: String, required: true },
    firebaseID: { type: String, required: true },
    name: { type: String, required: true },
    profileImg: { type: String, required: true },
    feedbackTitle: { type: String, required: true },
    feedbackDescription: { type: String, required: true },
    feedbackDate: { type: Number, default: (new Date()).getTime() }
});
const FeedbackSchema = mongoose_1.default.models.feedback || mongoose_1.default.model('feedback', feedbackSchema);
module.exports = FeedbackSchema;
