"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateSignupToken = exports.generateSignupToken = void 0;
const jwt = require('jsonwebtoken');
require('dotenv').config();
function generateSignupToken(user) { return jwt.sign(user, process.env.SIGNUP_TOKEN_SECRET, { expiresIn: '1d' }); }
exports.generateSignupToken = generateSignupToken;
;
function authenticateSignupToken(req, res, next) {
    if (req.params.token == null)
        return res.status(401).json({ error: "Access token error!." });
    jwt.verify(req.params.token, process.env.SIGNUP_TOKEN_SECRET, (error, user) => {
        if (error)
            return res.status(403).json({ error: "Token is invalid or has expired." });
        req.id = user.id;
        req.type = user.type;
        next();
    });
}
exports.authenticateSignupToken = authenticateSignupToken;
