import { object, string, number, TypeOf } from "zod";
import { earningDetails } from "./earning.schema";

export const influencerDetails = object({
body: 
    object({
        _id: string().optional(),
        email: string({ required_error: 'Please Mention Your Email!' }).email({ message: 'Invalid Email Address!' }),
        firebaseID: string({ required_error: 'Please Mention The Firebase ID!' }),
        name: string({ required_error: 'Please Mention Your Name!' }).optional().nullable(),
        platform: string().optional().nullable(),
        platformLogo: string().url({ message: 'Invalid URL!' }).optional().nullable(),
        influencerLogo: string().url({ message: 'Invalid URL!' }).optional().nullable(),
        influencerLogoKey: string().optional().nullable(),
        profileLink: string({ required_error: 'Please Provide the Profile Link!' }).optional().nullable(),
        location: string({ required_error: 'Please Provide the Location!' }).optional().nullable(),
        state: string({ required_error: 'Please Provide the Location!' }).optional().nullable(),
        city: string({ required_error: 'Please Provide the Location!' }).optional().nullable(),
        username: string({ required_error: 'Please Provide the Username!' }).optional().nullable(),
        gender: string({ required_error: 'Please Provide the Gender!' }).optional().nullable(),
        age: string({ required_error: 'Please Provide the Age!' }).optional().nullable(),
        bio: string({ required_error: 'Please Provide the Bio!' }).optional().nullable(),
        upiID: string({ required_error: 'Please Provide the upi ID!' }).optional().nullable(),
        industry: string({ required_error: 'Please Provide the Industry!' }).optional().nullable(),
        subIndustry: string({ required_error: 'Please Provide the Sub-Industry!' }).optional().nullable(),
        audienceSize: string().optional().nullable(),
        savedJobsID: string().array().optional(),
        earningDetails: earningDetails.optional()
    })
});

export type InfluencerDetails = TypeOf<typeof influencerDetails>["body"];