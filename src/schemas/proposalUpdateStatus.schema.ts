import { object, string, TypeOf } from "zod";

export const proposalUpdateSchema = object({
body: 
    object({
        _id: string().optional(),
        jobID: string({ required_error: 'Please Provide Job ID!' }),
        proposalStatus: string({ required_error: 'Please Provide the Status!' }),
        completedWorkLink: string({ required_error: 'Please Provide Completed Work Link!' }).url().optional(),
    })
});

export type ProposalUpdateSchema = TypeOf<typeof proposalUpdateSchema>['body'];