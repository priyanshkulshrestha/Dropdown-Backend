"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.influencerDetails = void 0;
const zod_1 = require("zod");
const earning_schema_1 = require("./earning.schema");
exports.influencerDetails = (0, zod_1.object)({
    body: (0, zod_1.object)({
        _id: (0, zod_1.string)().optional(),
        email: (0, zod_1.string)({ required_error: 'Please Mention Your Email!' }).email({ message: 'Invalid Email Address!' }),
        firebaseID: (0, zod_1.string)({ required_error: 'Please Mention The Firebase ID!' }),
        name: (0, zod_1.string)({ required_error: 'Please Mention Your Name!' }).optional().nullable(),
        platform: (0, zod_1.string)().optional().nullable(),
        platformLogo: (0, zod_1.string)().url({ message: 'Invalid URL!' }).optional().nullable(),
        influencerLogo: (0, zod_1.string)().url({ message: 'Invalid URL!' }).optional().nullable(),
        influencerLogoKey: (0, zod_1.string)().optional().nullable(),
        profileLink: (0, zod_1.string)({ required_error: 'Please Provide the Profile Link!' }).optional().nullable(),
        location: (0, zod_1.string)({ required_error: 'Please Provide the Location!' }).optional().nullable(),
        state: (0, zod_1.string)({ required_error: 'Please Provide the Location!' }).optional().nullable(),
        city: (0, zod_1.string)({ required_error: 'Please Provide the Location!' }).optional().nullable(),
        username: (0, zod_1.string)({ required_error: 'Please Provide the Username!' }).optional().nullable(),
        gender: (0, zod_1.string)({ required_error: 'Please Provide the Gender!' }).optional().nullable(),
        age: (0, zod_1.string)({ required_error: 'Please Provide the Age!' }).optional().nullable(),
        bio: (0, zod_1.string)({ required_error: 'Please Provide the Bio!' }).optional().nullable(),
        upiID: (0, zod_1.string)({ required_error: 'Please Provide the upi ID!' }).optional().nullable(),
        industry: (0, zod_1.string)({ required_error: 'Please Provide the Industry!' }).optional().nullable(),
        subIndustry: (0, zod_1.string)({ required_error: 'Please Provide the Sub-Industry!' }).optional().nullable(),
        audienceSize: (0, zod_1.string)().optional().nullable(),
        savedJobsID: (0, zod_1.string)().array().optional(),
        earningDetails: earning_schema_1.earningDetails.optional()
    })
});
