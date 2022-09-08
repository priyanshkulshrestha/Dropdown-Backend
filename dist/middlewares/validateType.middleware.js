"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const validateRequest = (schema) => (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params
        });
        next();
    }
    catch (e) {
        return res.status(400).send({
            success: false,
            messege: e.errors[0].message
        });
    }
};
exports.validateRequest = validateRequest;
exports.default = exports.validateRequest;
