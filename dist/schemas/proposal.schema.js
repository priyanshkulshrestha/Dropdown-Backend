"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.proposalDetails = void 0;
const zod_1 = require("zod");
exports.proposalDetails = (0, zod_1.object)({
    body: (0, zod_1.object)({
        _id: (0, zod_1.string)().optional(),
        jobID: (0, zod_1.string)({ required_error: 'Please Provide Job ID!' }),
        jobTitle: (0, zod_1.string)({ required_error: 'Please Provide Job Title!' }).optional(),
        clientID: (0, zod_1.string)({ required_error: 'Please Provide Client ID!' }).optional(),
        influencerName: (0, zod_1.string)({ required_error: 'Please Provide the Influencer Name!' }).optional(),
        profileImage: (0, zod_1.string)({ required_error: 'Please Provide the Profile Image!' }).optional(),
        profileLink: (0, zod_1.string)({ required_error: 'Please Provide the Profile Link!' }).optional(),
        location: (0, zod_1.string)({ required_error: 'Please Provide the Location!' }).optional(),
        username: (0, zod_1.string)({ required_error: 'Please Provide the Username!' }).optional(),
        influencerID: (0, zod_1.string)({ required_error: 'Please Provide the Influencer ID!' }),
        gender: (0, zod_1.string)({ required_error: 'Please Provide the Gender!' }).optional(),
        age: (0, zod_1.string)({ required_error: 'Please Provide the Age!' }).optional(),
        bidValue: (0, zod_1.string)({ required_error: 'Please Provide Bid Value!' }).nullable(),
        bio: (0, zod_1.string)({ required_error: 'Please Provide the Bio!' }).optional(),
        industry: (0, zod_1.string)({ required_error: 'Please Provide the Industry!' }).optional(),
        subIndustry: (0, zod_1.string)({ required_error: 'Please Provide the Sub-Industry!' }).array().optional(),
        isVerified: (0, zod_1.boolean)().optional(),
        proposalStatus: (0, zod_1.string)({ required_error: 'Please Provide the Status!' }).optional(),
        audienceSize: (0, zod_1.string)({ required_error: 'Please Provide Audience Size!' }).optional(),
        completedWorkLink: (0, zod_1.string)({ required_error: 'Please Provide the Status!' }).url().optional().nullable(),
        workStatus: (0, zod_1.string)({ required_error: 'Please Provide the Work Status!' }).optional(),
        upiID: (0, zod_1.string)({ required_error: 'Please Provide the UPI ID!' }).optional(),
    })
});
