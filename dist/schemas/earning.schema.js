"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.earningDetails = exports.earningDetailsInput = void 0;
const zod_1 = require("zod");
exports.earningDetailsInput = (0, zod_1.object)({
    body: (0, zod_1.object)({
        _id: (0, zod_1.string)().optional(),
        country: (0, zod_1.string)({ required_error: 'Please Mention the Country Name!' }),
        companyLogo: (0, zod_1.string)({ required_error: 'Please Mention the Company Logo!' }),
        companyName: (0, zod_1.string)({ required_error: 'Please Mention the Company Name!' }),
        earningValue: (0, zod_1.string)({ required_error: 'Please Mention the Earning value!' }),
        dateOfPayment: (0, zod_1.string)({ required_error: 'Please Mention the Date Of Payment!' }).optional(),
    })
});
exports.earningDetails = (0, zod_1.array)(exports.earningDetailsInput);
