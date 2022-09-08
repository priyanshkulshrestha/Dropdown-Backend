const jwt = require('jsonwebtoken');
require('dotenv').config();

export function generateSignupToken(user: any) { return jwt.sign(user, process.env.SIGNUP_TOKEN_SECRET, { expiresIn: '1d' } )};

export function authenticateSignupToken(req: any, res: any, next: any) {
    if (req.params.token == null) 
    return res.status(401).json({error: "Access token error!."});
    jwt.verify(req.params.token, process.env.SIGNUP_TOKEN_SECRET, (error: any, user: any) => {
        if (error) return res.status(403).json({ error: "Token is invalid or has expired." });
        req.id = user.id;
        req.type = user.type
        next()
    });
}