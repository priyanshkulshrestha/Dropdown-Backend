"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.proposalUpdateSchema = void 0;
const zod_1 = require("zod");
exports.proposalUpdateSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        _id: (0, zod_1.string)().optional(),
        jobID: (0, zod_1.string)({ required_error: 'Please Provide Job ID!' }),
        proposalStatus: (0, zod_1.string)({ required_error: 'Please Provide the Status!' }),
        completedWorkLink: (0, zod_1.string)({ required_error: 'Please Provide Completed Work Link!' }).url().optional(),
    })
});
