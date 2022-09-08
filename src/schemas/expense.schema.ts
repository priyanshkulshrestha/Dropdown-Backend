import { object, string, TypeOf, array, number } from "zod";

export const expenseDetailsInput = object({
body: 
    object({
        _id: string().optional(),
        influencerName: string({ required_error: 'Please Mention the Influencer Name!' }).optional(),
        username: string({ required_error: 'Please Mention the Influencer Name!' }).optional(),
        profileLogo: string({ required_error: 'Please Mention the Influencer ID!' }).optional(),
        influencerID: string({ required_error: 'Please Mention the Influencer ID!' }).optional(),
        paymentValue: string({ required_error: 'Please Mention the Payment value!' }).optional(),
        dateOfVerification: string({ required_error: 'Please Mention the Date Of Verification!' }).optional(),
    })
});

export const expenseDetails = array(expenseDetailsInput)

export type ExpenseDetailsInput = TypeOf<typeof expenseDetailsInput>["body"];

export type ExpenseDetails = TypeOf<typeof expenseDetails>;