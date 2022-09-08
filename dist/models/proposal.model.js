"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const proposalSchema = new Schema({
    jobID: { type: String, required: true },
    jobTitle: { type: String, required: true },
    clientID: { type: String, required: true },
    companyName: { type: String, required: true },
    brandLogo: { type: String, required: true },
    influencerName: { type: String, required: true },
    profileImage: { type: String, required: true },
    profileLink: { type: String, required: true },
    location: { type: String, required: true },
    username: { type: String, required: true },
    influencerID: { type: String, required: true },
    gender: { type: String, required: true },
    age: { type: String, required: true },
    bidValue: { type: String, required: true },
    bio: { type: String, required: false, default: null },
    industry: { type: String, required: true },
    subIndustry: [{ type: String, required: true }],
    isVerified: { type: Boolean, required: true },
    proposalStatus: { type: String, default: 'REVIEW' },
    audienceSize: { type: String, default: null },
    completedWorkLink: { type: String, default: null },
    workStatus: { type: String, default: null },
    upiID: { type: String, required: false, default: null },
    postDate: { type: Number, required: true, default: (new Date()).getTime() },
});
const ProposalSchema = mongoose_1.default.models.proposal || mongoose_1.default.model('proposal', proposalSchema);
module.exports = ProposalSchema;
