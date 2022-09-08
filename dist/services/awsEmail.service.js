"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const verifyToken_middleware_1 = require("../middlewares/verifyToken.middleware");
const ses = new aws_sdk_1.default.SES({ region: 'ap-south-1' });
const sendEmail = (user, type) => __awaiter(void 0, void 0, void 0, function* () {
    let mail = user.email;
    let id = user._id.toString();
    const signupToken = (0, verifyToken_middleware_1.generateSignupToken)({ id, type });
    const url = `https://qo5yxkab35.execute-api.ap-south-1.amazonaws.com/api/v1/verify/${signupToken}`;
    const params = {
        Source: 'notify@dropdown.buzz',
        Destination: {
            ToAddresses: [mail],
        },
        Message: {
            Body: {
                Text: {
                    Data: `This is a test mail for Signup. Visit this link to verify ${url}`,
                },
            },
            Subject: {
                Data: 'Test',
            },
        },
    };
    try {
        const res = yield ses.sendEmail(params).promise();
        console.log(res);
    }
    catch (e) {
        console.log(e);
    }
});
exports.sendEmail = sendEmail;
