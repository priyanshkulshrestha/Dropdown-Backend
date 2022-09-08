import { object, string, TypeOf, array, number } from "zod";

export const earningDetailsInput = object({
body: 
    object({
        _id: string().optional(),
        country: string({ required_error: 'Please Mention the Country Name!' }),
        companyLogo: string({ required_error: 'Please Mention the Company Logo!' }),
        companyName: string({ required_error: 'Please Mention the Company Name!' }),
        earningValue: string({ required_error: 'Please Mention the Earning value!' }),
        dateOfPayment: string({ required_error: 'Please Mention the Date Of Payment!' }).optional(),
    })
});

export const earningDetails = array(earningDetailsInput)

export type EarningDetailsInput = TypeOf<typeof earningDetailsInput>["body"];

export type EarningDetails = TypeOf<typeof earningDetails>;