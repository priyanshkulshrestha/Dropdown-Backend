"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewDetails = void 0;
const zod_1 = require("zod");
exports.reviewDetails = (0, zod_1.object)({
    body: (0, zod_1.object)({
        _id: (0, zod_1.string)().optional(),
        influencerID: (0, zod_1.string)({ required_error: 'Please Provide Influencer ID!' }),
        clientID: (0, zod_1.string)({ required_error: 'Please Provide Influencer ID!' }),
        username: (0, zod_1.string)({ required_error: 'Please Provide Username!' }).optional(),
        influencerName: (0, zod_1.string)({ required_error: 'Please Provide Influencer Name!' }).optional(),
        clientName: (0, zod_1.string)({ required_error: 'Please Provide Client Name!' }).optional(),
        companyName: (0, zod_1.string)().optional(),
        brandLogo: (0, zod_1.string)().optional(),
        reviewDescription: (0, zod_1.string)({ required_error: 'Please Provide Review Description!' }),
        reviewRating: (0, zod_1.string)({ required_error: 'Please Provide Review Rating!' }),
    })
});
