"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const influencerSchema = new Schema({
    email: { type: String, unique: true },
    firebaseID: { type: String, unique: true, required: true },
    name: { type: String, default: null },
    platform: { type: String, default: null },
    platformLogo: { type: String, default: null },
    influencerLogo: { type: String, default: 'https://dropdown-files.s3.us-west-2.amazonaws.com/logos/default.png' },
    influencerLogoKey: { type: String, default: null },
    profileLink: { type: String, default: null },
    location: { type: String, default: null },
    state: { type: String, default: null },
    city: { type: String, default: null },
    username: { type: String, default: null },
    gender: { type: String, default: null },
    age: { type: String, default: null },
    bio: { type: String, default: null },
    upiID: { type: String, default: null },
    industry: { type: String, default: null },
    subIndustry: { type: [String], default: [] },
    audienceSize: { type: String, default: null },
    savedJobsID: { type: [String], default: [] },
    creationDate: { type: Number, default: (new Date()).getTime() },
    isVerified: { type: Boolean, default: false },
    earningDetails: {
        type: [{
                country: { type: String, required: true },
                companyLogo: { type: String, required: true },
                companyName: { type: String, required: true },
                earningValue: { type: String, required: true },
                dateOfPayment: { type: Number, required: true, default: (new Date()).getTime() },
            }],
        default: []
    }
});
const InfluencerSchema = mongoose_1.default.models.influencer || mongoose_1.default.model('influencer', influencerSchema);
module.exports = InfluencerSchema;
