"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobPostDetails = exports.jobPostDetailsInput = void 0;
const zod_1 = require("zod");
exports.jobPostDetailsInput = (0, zod_1.object)({
    body: (0, zod_1.object)({
        _id: (0, zod_1.string)().optional(),
        firebaseID: (0, zod_1.string)({ required_error: 'Please Mention The Firebase ID!' }).optional(),
        companyName: (0, zod_1.string)({ required_error: 'Please Mention Your Company Name!' }).optional(),
        brandLogo: (0, zod_1.string)().url({ message: 'Invalid URL!' }).optional(),
        platformLogo: (0, zod_1.string)({ required_error: 'Please Provide Platform' }).optional(),
        jobTitle: (0, zod_1.string)({ required_error: 'Please Mention the Job Title!' }).optional(),
        platformChoice: (0, zod_1.string)({ required_error: 'Please Mention the Chosen Platform!' }).optional(),
        industry: (0, zod_1.string)({ required_error: 'Please Mention the Chosen Industry!' }).optional(),
        subIndustry: (0, zod_1.string)({ required_error: 'Please Mention the Chosen Sub-Industry!' }).optional(),
        campaignLocation: (0, zod_1.string)({ required_error: 'Please Mention the Campaign Location!' }).optional(),
        campaignState: (0, zod_1.string)({ required_error: 'Please Mention the Campaign State!' }).optional().nullable(),
        campaignCity: (0, zod_1.string)({ required_error: 'Please Mention the Campaign City!' }).optional().nullable(),
        budgetType: (0, zod_1.string)({ required_error: 'Please Mention the Budget Type!' }).optional(),
        budget: (0, zod_1.string)({ required_error: 'Please Mention the Budget!' }).optional().nullable(),
        othersType: (0, zod_1.string)({ required_error: 'Please Mention the Other Type!' }).optional().nullable(),
        othersDescription: (0, zod_1.string)({ required_error: 'Please Provide the Other Description!' }).optional().nullable(),
        task: (0, zod_1.string)({ required_error: 'Please Mention the Task!' }).array().optional(),
        description: (0, zod_1.string)({ required_error: 'Please Provide the Description!' }).optional(),
        status: (0, zod_1.string)({ required_error: 'Please Provide the Status!' }).optional(),
        postDate: (0, zod_1.number)().optional(),
        gender: (0, zod_1.string)({ required_error: 'Please Mention the Chosen Gender!' }).optional().nullable(),
        age: (0, zod_1.string)({ required_error: 'Please Provide the Age!' }).optional().nullable(),
        noOfInfluencers: (0, zod_1.string)({ required_error: 'Please Mention the Chosen No. of Influencers!' }).optional().nullable(),
        audienceSize: (0, zod_1.string)({ required_error: 'Please Mention the Chosen Audience Size!' }).optional().nullable(),
        noOfProposals: (0, zod_1.string)({ required_error: 'Please Mention the Chosen No. of Proposals!' }).optional().nullable(),
        noOfHires: (0, zod_1.string)({ required_error: 'Please Mention the Chosen No. of Proposals!' }).optional().nullable(),
        noOfCompleted: (0, zod_1.string)({ required_error: 'Please Mention the Chosen No. of Proposals!' }).optional().nullable(),
        campaignDate: (0, zod_1.string)({ required_error: 'Please Provide the Campaign Date!' }).optional().nullable(),
        campaignTime: (0, zod_1.string)({ required_error: 'Please Provide the Campaign Time!' }).optional().nullable(),
    })
});
exports.jobPostDetails = (0, zod_1.array)(exports.jobPostDetailsInput);
