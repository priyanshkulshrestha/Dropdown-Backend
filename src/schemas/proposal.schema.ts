import { object, string, TypeOf, boolean } from "zod";

export const proposalDetails = object({
body: 
    object({
        _id: string().optional(),
        jobID: string({ required_error: 'Please Provide Job ID!' }),
        jobTitle: string({ required_error: 'Please Provide Job Title!' }).optional(),
        clientID: string({ required_error: 'Please Provide Client ID!' }).optional(),
        influencerName: string({ required_error: 'Please Provide the Influencer Name!' }).optional(),
        profileImage: string({ required_error: 'Please Provide the Profile Image!' }).optional(),
        profileLink: string({ required_error: 'Please Provide the Profile Link!' }).optional(),
        location: string({ required_error: 'Please Provide the Location!' }).optional(),
        username: string({ required_error: 'Please Provide the Username!' }).optional(),
        influencerID: string({ required_error: 'Please Provide the Influencer ID!' }),
        gender: string({ required_error: 'Please Provide the Gender!' }).optional(),
        age: string({ required_error: 'Please Provide the Age!' }).optional(),
        bidValue: string({ required_error: 'Please Provide Bid Value!' }).nullable(),
        bio: string({ required_error: 'Please Provide the Bio!' }).optional(),
        industry: string({ required_error: 'Please Provide the Industry!' }).optional(),
        subIndustry: string({ required_error: 'Please Provide the Sub-Industry!' }).array().optional(),
        isVerified: boolean().optional(),
        proposalStatus: string({ required_error: 'Please Provide the Status!' }).optional(),
        audienceSize: string({ required_error: 'Please Provide Audience Size!' }).optional(),
        completedWorkLink: string({ required_error: 'Please Provide the Status!' }).url().optional().nullable(),
        workStatus: string({ required_error: 'Please Provide the Work Status!' }).optional(),
        upiID: string({ required_error: 'Please Provide the UPI ID!' }).optional(),
    })
});

export type ProposalDetails = TypeOf<typeof proposalDetails>['body'];