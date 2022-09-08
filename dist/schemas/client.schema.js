"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientDetails = void 0;
const zod_1 = require("zod");
const jobPost_schema_1 = require("./jobPost.schema");
const expense_schema_1 = require("./expense.schema");
exports.clientDetails = (0, zod_1.object)({
    body: (0, zod_1.object)({
        _id: (0, zod_1.string)().optional(),
        email: (0, zod_1.string)({ required_error: 'Please Mention Your Email!' }).email({ message: 'Invalid Email Address!' }).optional(),
        firebaseID: (0, zod_1.string)({ required_error: 'Please Mention The Firebase ID!' }),
        name: (0, zod_1.string)({ required_error: 'Please Mention Your Name!' }).optional(),
        companyName: (0, zod_1.string)({ required_error: 'Please Mention Your Company Name!' }).optional(),
        location: (0, zod_1.string)({ required_error: 'Please Mention Your Location!' }).optional(),
        websiteLink: (0, zod_1.string)().url({ message: 'Invalid URL!' }).optional().nullable(),
        brandLogo: (0, zod_1.string)().url({ message: 'Invalid URL!' }).optional().nullable(),
        brandLogoKey: (0, zod_1.string)().optional().nullable(),
        jobPostDetails: jobPost_schema_1.jobPostDetails.optional(),
        expenseDetails: expense_schema_1.expenseDetails.optional()
    })
});
