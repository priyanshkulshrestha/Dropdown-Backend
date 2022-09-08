"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expenseDetails = exports.expenseDetailsInput = void 0;
const zod_1 = require("zod");
exports.expenseDetailsInput = (0, zod_1.object)({
    body: (0, zod_1.object)({
        _id: (0, zod_1.string)().optional(),
        influencerName: (0, zod_1.string)({ required_error: 'Please Mention the Influencer Name!' }).optional(),
        username: (0, zod_1.string)({ required_error: 'Please Mention the Influencer Name!' }).optional(),
        profileLogo: (0, zod_1.string)({ required_error: 'Please Mention the Influencer ID!' }).optional(),
        influencerID: (0, zod_1.string)({ required_error: 'Please Mention the Influencer ID!' }).optional(),
        paymentValue: (0, zod_1.string)({ required_error: 'Please Mention the Payment value!' }).optional(),
        dateOfVerification: (0, zod_1.string)({ required_error: 'Please Mention the Date Of Verification!' }).optional(),
    })
});
exports.expenseDetails = (0, zod_1.array)(exports.expenseDetailsInput);
