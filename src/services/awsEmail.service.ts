import AWS from 'aws-sdk';
import { generateSignupToken } from '../middlewares/verifyToken.middleware';

const ses = new AWS.SES({ region: 'ap-south-1' });

export const sendEmail = async (user: any, type: string) => {
    let mail = user.email;
    let id = user._id.toString();
    const signupToken = generateSignupToken({id, type});
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
    }

    try {
        const res = await ses.sendEmail(params).promise();
        console.log(res);
    } catch(e) {
        console.log(e);
    }
} 