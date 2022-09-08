import { object, string, TypeOf, number } from "zod";

export const reviewDetails = object({
body: 
    object({
        _id: string().optional(),
        influencerID: string({ required_error: 'Please Provide Influencer ID!' }),
        clientID: string({ required_error: 'Please Provide Influencer ID!' }),
        username: string({ required_error: 'Please Provide Username!' }).optional(),
        influencerName: string({ required_error: 'Please Provide Influencer Name!' }).optional(),
        clientName: string({ required_error: 'Please Provide Client Name!' }).optional(),
        companyName: string().optional(),
        brandLogo: string().optional(),
        reviewDescription: string({ required_error: 'Please Provide Review Description!' }),
        reviewRating: string({ required_error: 'Please Provide Review Rating!' }),
    })
});

export type ReviewDetails = TypeOf<typeof reviewDetails>['body'];