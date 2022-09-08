import { Request, Response } from "express";
import MongoErrorHandler from "../services/mongoError.service";
import ClientSchema from "../models/client.model";
import { ClientDetails } from "../schemas/client.schema";
import { JobPostDetailsInput } from "../schemas/jobPost.schema";
import { s3Upload } from "../services/imageUpload.service";
import InfluencerSchema from "../models/influencer.model";
import ReviewSchema from "../models/review.model";
import { sendEmail } from "../services/awsEmail.service";
require('dotenv').config();

export const CreateClientHandler = async (req: Request<{}, {}, Partial<ClientDetails>>, res: Response) => { 
    let body = req.body; 
    let newClient = new ClientSchema(body);
    await ClientSchema.create(newClient)
    .then(async () => {
        newClient = newClient.toJSON(); 
        await sendEmail(newClient, 'client');
        delete newClient.__v; delete newClient.creationDate; 
        res.json({
            success: true,
            client: newClient
        });
    })
    .catch(err => { res.json(MongoErrorHandler(err)); })
}

export const PostJobHandler = async (req: Request, res: Response) => {
    try {
        if(typeof (req.body) === 'string') req.body = JSON.parse(req.body);
        let firebaseID = req.body.firebaseID;
        req.body.platformLogo = `https://dropdown-files.s3.us-west-2.amazonaws.com/logos/${(req.body.platformChoice)?.toLocaleLowerCase()}.png`
        try {
            var client = await ClientSchema.findOne({ firebaseID })
            req.body.brandLogo = client.brandLogo, req.body.companyName = client.companyName
        } catch(e) {
            console.log(e)
            let successflag = JSON.stringify({
                success: false,
            })
            res.send(successflag)
        }
        let sI
        if(req.body.subIndustry === undefined) {
            sI = [];
        } else {
            sI = req.body.subIndustry.split(",")
        }
        let request_body: any = { ...req.body, subIndustry: sI }
        var updatedClient = await ClientSchema.updateOne({ firebaseID }, { $push: { jobPostDetails: request_body } }, { new: true, returnDocument: 'after' });
        var newClient = await ClientSchema.findOne({ firebaseID })
        newClient = newClient.toJSON();
        delete newClient.creationDate
        for(let job of newClient.jobPostDetails) {
            job.noOfCompleted = job.noOfCompleted.toString()
            job.noOfProposals = job.noOfProposals.toString()
            job.noOfHires = job.noOfHires.toString()
        }
        let latestJob = newClient.jobPostDetails;
        latestJob = latestJob[latestJob.length - 1];
        newClient.jobPostDetails.reverse()
        if(updatedClient.acknowledged === true) {
            res.json({
                success: true,
                jobList: newClient.jobPostDetails,
                latestJob: latestJob
            });
        } else {
            res.send({
                success: false,
            })
        }
    }
    catch(err) { console.log(err), res.json(err) };
}

export const UpdateJobHandler = async (req: Request<{}, {}, Partial<JobPostDetailsInput>>, res: Response) => {
    try {
        let id = req.body._id, latestJob; let request_body: any = req.body
        let client = await ClientSchema.findOne({ 'jobPostDetails._id': id }, { creationDate: 0 });
        let job: any = await ClientSchema.findOne({ firebaseID: client.firebaseID }, { _id: 0, jobPostDetails: { $elemMatch: { _id: id } } });
        job = job.jobPostDetails[0]
        if(request_body.firebaseID == undefined) request_body.firebaseID = job.firebaseID;
        if(request_body.companyName == undefined) request_body.companyName = job.companyName;
        if(request_body.brandLogo == undefined) request_body.brandLogo = job.brandLogo;
        if(request_body.platformLogo == undefined) request_body.platformLogo = job.platformLogo;
        if(request_body.jobTitle == undefined) request_body.jobTitle = job.jobTitle;
        if(request_body.platformChoice == undefined) request_body.platformChoice = job.platformChoice;
        if(request_body.industry == undefined) request_body.industry = job.industry;
        if(request_body.subIndustry == undefined) {
            request_body.subIndustry = job.subIndustry;
        } else {
            request_body.subIndustry = request_body.subIndustry.split(",");
        } 
        if(request_body.campaignLocation == undefined) request_body.campaignLocation = job.campaignLocation;
        if(request_body.campaignState == undefined) request_body.campaignState = job.campaignState;
        if(request_body.campaignCity == undefined) request_body.campaignCity = job.campaignCity;
        if(request_body.budgetType == undefined) request_body.budgetType = job.budgetType;
        if(request_body.budget == undefined) request_body.budget = job.budget;
        if(request_body.othersType == undefined) request_body.othersType = job.othersType;
        if(request_body.othersDescription == undefined) request_body.othersDescription = job.othersDescription;
        if(request_body.task == undefined) request_body.task = job.task;
        if(request_body.description == undefined) request_body.description = job.description;
        if(request_body.status == undefined) request_body.status = job.status;
        if(request_body.postDate == undefined) request_body.postDate = job.postDate;
        if(request_body.age == undefined) request_body.age = job.age;
        if(request_body.gender == undefined) request_body.gender = job.gender;
        if(request_body.audienceSize == undefined) request_body.audienceSize = job.audienceSize;
        if(request_body.noOfInfluencers == undefined) request_body.noOfInfluencers = job.noOfInfluencers;
        if(request_body.noOfProposals == undefined) request_body.noOfProposals = job.noOfProposals;
        if(request_body.noOfHires == undefined) request_body.noOfHires = job.noOfHires;
        if(request_body.noOfCompleted == undefined) request_body.noOfCompleted = job.noOfCompleted;
        if(request_body.campaignDate == undefined) request_body.campaignDate = job.campaignDate;
        if(request_body.campaignTime == undefined) request_body.campaignTime = job.campaignTime;
        request_body.platformLogo = `https://dropdown-files.s3.us-west-2.amazonaws.com/logos/${(request_body.platformChoice)?.toLocaleLowerCase()}.png`
        let updatedClient = await ClientSchema.updateOne({ 'jobPostDetails._id': id }, {
            $set: {
                'jobPostDetails.$': request_body
            }
        }, { new: true });
        let newClient = await ClientSchema.findOne({ 'jobPostDetails._id': id }, {creationDate: 0})
        for(let job of newClient.jobPostDetails) {
            job.noOfCompleted = job.noOfCompleted.toString()
            job.noOfProposals = job.noOfProposals.toString()
            job.noOfHires = job.noOfHires.toString()
        }
        newClient.jobPostDetails.reverse()
        latestJob = newClient.jobPostDetails.find((job: JobPostDetailsInput) => job._id == id);
        if(updatedClient.acknowledged === true) {
            res.json({
                success: true,
                jobList: newClient.jobPostDetails,
                latestJob
            });
        } else {
            res.json({
                success: false,
            });
        }
    }
    catch(err) { console.log(err), res.json(err) };
}

export const CloseJobHandler = async (req: Request<{}, {}, Partial<JobPostDetailsInput>>, res: Response) => {
    let updatedClient = await ClientSchema.updateOne({ 'jobPostDetails._id': req.body._id }, {
        $set: {
            'jobPostDetails.$.status': "CLOSED"
        }
    }, { new: true });
    if(updatedClient.acknowledged === true) {
        res.json({
            success: true
        });
    } else {
        res.json({
            success: false
        });
    }
}

export const UpdateClientHandler = async (req: Request, res: Response) => {
    try {
        let prevClient = await ClientSchema.findOne({ firebaseID: req.body.firebaseID }, { jobPostDetails: 0, expenseDetails: 0, __v: 0, creationDate: 0 });
        let name = prevClient.name, companyName = prevClient.companyName, websiteLink = prevClient.websiteLink, 
        location = prevClient.location, brandLogo = prevClient.brandLogo, brandLogoKey = prevClient.brandLogoKey;
        if(req.body.name !==  undefined) name = req.body.name;
        if(req.body.companyName !==  undefined) companyName = req.body.companyName;
        if(req.body.websiteLink !==  undefined) websiteLink = req.body.websiteLink;
        if(req.body.location !==  undefined) location = req.body.location;
        if(req.body.brandLogo !== undefined) brandLogo = req.body.brandLogo;
        console.log(req.body.brandLogo)
        await ClientSchema.updateOne({ firebaseID: req.body.firebaseID }, {
            $set: {
                name,
                companyName,
                websiteLink,
                location,
                brandLogo: req.body.brandLogo || brandLogo,
                brandLogoKey,
                'jobPostDetails.$[].companyName': companyName,
                'jobPostDetails.$[].brandLogo': brandLogo
            }
        })
        .then(async () => {
            let newClient = await ClientSchema.findOne({ firebaseID: req.body.firebaseID }, { 'jobPostDetails.companyName': 0, 'jobPostDetails.brandLogo': 0, creationDate: 0 });
            res.json({
                success: true,
                client: newClient
            });
        })
        .catch(err => { res.json(MongoErrorHandler(err)) })
    } catch(e) { 
        console.log(e), 
        res.json({
            success: false,
        }); 
    } 
}

export const GetAllClientDetails = async (req: Request, res: Response) => {
    try {
        let allClient = await ClientSchema.find({}, { 'jobPostDetails.companyName': 0, 'jobPostDetails.brandLogo': 0, creationDate: 0 });
        if(allClient.length === 0)
            throw "Clients empty";
        res.json({
            success: true,
            allClient,
        });
    } catch(e) { 
        console.log(e), 
        res.json({
            success: false,
        }); 
    } 
}

export const GetAllDetails = async (req: Request, res: Response) => {
    try {
        if(req.params.id === "influencer") {
            let influencer = await InfluencerSchema.findOne({ firebaseID: req.headers.influencerid }, { _id: 0, __v: 0, earningDetails: 0, savedJobsID: 0, upiID: 0})
            influencer = influencer.toJSON();
            delete influencer.creationDate;
            let reviews = await ReviewSchema.find({ influencerID: req.headers.influencerid }, { _id: 0, __v: 0 })
            res.json({
                success: true,
                influencer, 
                reviews
            });
        } else {
            let firebaseID = req.headers.firebaseid
            let client = await ClientSchema.find({ firebaseID });
            let newClient = client[0];
            newClient = newClient.toJSON();
            delete newClient.creationDate
            if(client.length === 0 && req.params.id !== "influencer")
                throw "No Client present by that ID";
            if(req.params.id === "all") {
                res.json({
                    success: true,
                    client: newClient,
                });
            } else if(req.params.id === "jobdetail") {
                let job: any = await ClientSchema.find({ firebaseID }, { jobPostDetails: { $elemMatch: { _id: req.headers._id} } });
                res.json({
                    success: true,
                    job: job[0].jobPostDetails[0]
                });
            } else if(req.params.id === "job") {
                let activeJobs: any = []
                let closedJobs: any = []
                client[0].jobPostDetails.map((job: any) => {
                    if(job.status === 'ACTIVE')
                    activeJobs.push(job)
                    else 
                    closedJobs.push(job)
                });
                activeJobs.reverse()
                closedJobs.reverse()
                res.json({
                    success: true,
                    activeJobs,
                    closedJobs
                });
            } else if(req.params.id === "hiredjob") {
                let jobPostDetails = client[0].jobPostDetails.filter((job: any) => job.noOfHires >= 1);
                jobPostDetails.reverse();
                res.json({
                    success: true,
                    jobs: jobPostDetails
                });
            } else if(req.params.id === "completedjob") {
                let jobPostDetails = client[0].jobPostDetails.filter((job: any) => job.noOfCompleted >= 1);
                jobPostDetails.reverse();
                res.json({
                    success: true,
                    jobs: jobPostDetails
                });
            } else if(req.params.id === "closedjob") {
                let jobPostDetails = client[0].jobPostDetails.filter((job: any) => job.status === "CLOSED");
                jobPostDetails.reverse();
                res.json({
                    success: true,
                    jobs: jobPostDetails
                });
            } else if(req.params.id === "expense") {
                let totalExpense = 0;
                let expenses = client[0].expenseDetails;
                expenses.map((expense: any) => {
                    if(parseInt(expense.paymentValue) !== -1)
                    totalExpense += parseInt(expense.paymentValue)
                });
                expenses.reverse()
                res.json({
                    success: true,
                    expenses,
                    totalExpense
                });
            } else {
                res.json({
                    success: false,
                });
            }
        }
    } catch(e) { 
        console.log(e), 
        res.json({
            success: false,
        }); 
    } 
}

export const DeleteClientHandler = async (req: Request, res: Response) => {
    try {
        let firebaseID = req.headers.firebaseid
        let deleteClient = await ClientSchema.deleteOne({ firebaseID });
        if (deleteClient.deletedCount === 1) { 
            return res.json({ 
                success: true 
            }); 
        }
        else { 
            return res.json({ 
                success: false 
            }); 
        }
    } catch(e) { 
        console.log(e); 
        return res.json({ 
            success: false 
        }); 
    }
}