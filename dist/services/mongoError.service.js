"use strict";
function MongoErrorHandler(err) {
    if (err.keyPattern !== undefined && err.keyPattern.email !== undefined && err.name === 'MongoServerError' && err.code === 11000) {
        return ({
            success: false,
            messege: "Email Exists!"
        });
    }
    else {
        console.log(err);
        return ({
            success: false,
            messege: 'MongoServerError'
        });
    }
}
module.exports = MongoErrorHandler;
