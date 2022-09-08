import { object, string, TypeOf, array, number } from "zod";

export const jobPostDetailsInput = object({
    body: 
        object({
        _id: string().optional(),
        firebaseID: string({ required_error: 'Please Mention The Firebase ID!' }).optional(),
        companyName: string({ required_error: 'Please Mention Your Company Name!' }).optional(),
        brandLogo: string().url({ message: 'Invalid URL!' }).optional(),
        platformLogo: string({ required_error: 'Please Provide Platform' }).optional(),
        jobTitle: string({ required_error: 'Please Mention the Job Title!' }).optional(),
        platformChoice: string({ required_error: 'Please Mention the Chosen Platform!' }).optional(),
        industry: string({ required_error: 'Please Mention the Chosen Industry!' }).optional(),
        subIndustry: string({ required_error: 'Please Mention the Chosen Sub-Industry!' }).optional(),
        campaignLocation: string({ required_error: 'Please Mention the Campaign Location!' }).optional(),
        campaignState: string({ required_error: 'Please Mention the Campaign State!' }).optional().nullable(),
        campaignCity: string({ required_error: 'Please Mention the Campaign City!' }).optional().nullable(),
        budgetType: string({ required_error: 'Please Mention the Budget Type!' }).optional(),
        budget: string({ required_error: 'Please Mention the Budget!' }).optional().nullable(),
        othersType: string({ required_error: 'Please Mention the Other Type!' }).optional().nullable(),
        othersDescription: string({ required_error: 'Please Provide the Other Description!' }).optional().nullable(),
        task: string({ required_error: 'Please Mention the Task!' }).array().optional(),
        description: string({ required_error: 'Please Provide the Description!' }).optional(),
        status: string({ required_error: 'Please Provide the Status!' }).optional(),
        postDate: number().optional(),
        gender: string({ required_error: 'Please Mention the Chosen Gender!' }).optional().nullable(),
        age: string({ required_error: 'Please Provide the Age!' }).optional().nullable(),
        noOfInfluencers: string({ required_error: 'Please Mention the Chosen No. of Influencers!' }).optional().nullable(),
        audienceSize: string({ required_error: 'Please Mention the Chosen Audience Size!' }).optional().nullable(),
        noOfProposals: string({ required_error: 'Please Mention the Chosen No. of Proposals!' }).optional().nullable(),
        noOfHires: string({ required_error: 'Please Mention the Chosen No. of Proposals!' }).optional().nullable(),
        noOfCompleted: string({ required_error: 'Please Mention the Chosen No. of Proposals!' }).optional().nullable(),
        campaignDate: string({ required_error: 'Please Provide the Campaign Date!' }).optional().nullable(),
        campaignTime: string({ required_error: 'Please Provide the Campaign Time!' }).optional().nullable(),
    })
});

export const jobPostDetails = array(jobPostDetailsInput)

export type JobPostDetailsInput = TypeOf<typeof jobPostDetailsInput>["body"];

export type JobPostDetails = TypeOf<typeof jobPostDetails>;