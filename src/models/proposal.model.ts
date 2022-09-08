import mongoose from "mongoose";

const Schema = mongoose.Schema;

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
})

const ProposalSchema = mongoose.models.proposal || mongoose.model('proposal', proposalSchema);

export = ProposalSchema;