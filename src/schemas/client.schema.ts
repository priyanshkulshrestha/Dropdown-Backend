import { object, string, number, TypeOf, array } from "zod";
import { jobPostDetails } from "./jobPost.schema";
import { expenseDetails } from "./expense.schema";

export const clientDetails = object({
body: 
    object({
        _id: string().optional(),
        email: string({ required_error: 'Please Mention Your Email!' }).email({ message: 'Invalid Email Address!' }).optional(),
        firebaseID: string({ required_error: 'Please Mention The Firebase ID!' }),
        name: string({ required_error: 'Please Mention Your Name!' }).optional(),
        companyName: string({ required_error: 'Please Mention Your Company Name!' }).optional(),
        location: string({ required_error: 'Please Mention Your Location!' }).optional(),
        websiteLink: string().url({ message: 'Invalid URL!' }).optional().nullable(),
        brandLogo: string().url({ message: 'Invalid URL!' }).optional().nullable(),
        brandLogoKey: string().optional().nullable(),
        jobPostDetails: jobPostDetails.optional(),
        expenseDetails: expenseDetails.optional()
    })
});

export type ClientDetails = TypeOf<typeof clientDetails>["body"];