"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const clientSchema = new Schema({
    email: { type: String, unique: true },
    firebaseID: { type: String, unique: true, required: true },
    name: { type: String, default: null },
    companyName: { type: String, default: null },
    websiteLink: { type: String, default: null },
    location: { type: String, default: null },
    brandLogo: { type: String, default: 'https://dropdown-files.s3.us-west-2.amazonaws.com/logos/default.png' },
    brandLogoKey: { type: String, default: null },
    creationDate: { type: Number, default: (new Date()).getTime() },
    isVerified: { type: Boolean, default: false },
    jobPostDetails: {
        type: [{
                firebaseID: { type: String, required: true },
                companyName: { type: String, required: true },
                brandLogo: { type: String, required: true },
                platformLogo: { type: String, required: true },
                jobTitle: { type: String, required: true },
                platformChoice: { type: String, required: true },
                industry: { type: String, required: true },
                subIndustry: [{ type: String, required: true }],
                campaignLocation: { type: String, required: true },
                campaignState: { type: String, required: true, default: null },
                campaignCity: { type: String, required: true, default: null },
                budgetType: { type: String, required: true },
                budget: { type: String, default: null },
                othersType: { type: String, default: null },
                othersDescription: { type: String, default: null },
                task: [{ type: String, required: true }],
                description: { type: String, required: true },
                status: { type: String, required: true, default: 'ACTIVE' },
                postDate: { type: Number, required: true, default: (new Date()).getTime() },
                gender: { type: String, default: null },
                age: { type: String, default: null },
                audienceSize: { type: String, default: null },
                noOfInfluencers: { type: String, default: null },
                noOfProposals: { type: Number, default: 0 },
                noOfHires: { type: Number, default: 0 },
                noOfCompleted: { type: Number, default: 0 },
                campaignDate: { type: String, default: null },
                campaignTime: { type: String, default: null },
            }],
        default: []
    },
    expenseDetails: {
        type: [{
                influencerName: { type: String, required: true },
                username: { type: String, required: true },
                profileLogo: { type: String, required: true },
                influencerID: { type: String, required: true },
                paymentValue: { type: String, required: true },
                dateOfVerification: { type: Number, required: true, default: (new Date()).getTime() },
            }],
        default: []
    },
});
const ClientSchema = mongoose_1.default.models.client || mongoose_1.default.model('client', clientSchema);
module.exports = ClientSchema;
