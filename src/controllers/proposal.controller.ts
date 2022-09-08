import { Request, Response } from "express";
import MongoErrorHandler from "../services/mongoError.service";
import ProposalSchema from "../models/proposal.model";
import { ProposalDetails } from "../schemas/proposal.schema";
import ClientSchema from "../models/client.model"
import InfluencerSchema from "../models/influencer.model";
import ReviewSchema from "../models/review.model";

export const CreateProposalHandler = async (req: any, res: Response) => { 
    let body = req.body;
    let client = await ClientSchema.findOne({ 'jobPostDetails._id': body.jobID });
    let influencer = await InfluencerSchema.findOne({ firebaseID: req.body.influencerID }, { creationDate: 0});
    body.clientID = client.firebaseID;
    body.companyName = client.companyName;
    body.brandLogo = client.brandLogo;
    for (const job of client.jobPostDetails) {
        if(job._id.toString() === body.jobID) { 
            body.jobTitle = job.jobTitle;
            break;
        }
    } 
    body.age = influencer.age, body.bio = influencer.bio, body.gender = influencer.gender, 
    body.industry = influencer.industry, body.influencerName = influencer.name, body.isVerified = influencer.isVerified, 
    body.location = influencer.location, body.profileImage = influencer.influencerLogo, body.profileLink = influencer.profileLink, 
    body.subIndustry = influencer.subIndustry, body.upiID = influencer.upiID, body.username = influencer.username,
    body.audienceSize = influencer.audienceSize; 
    if(body.profileImage === null) body.profileImage = "NA";
    if(body.profileLink === null) body.profileLink = "NA";
    let newProposal = new ProposalSchema(body);
    await ProposalSchema.create(newProposal)
    .then(async () => {
        await ClientSchema.updateOne({ 'jobPostDetails._id': body.jobID }, {
            $inc: {
                'jobPostDetails.$.noOfProposals': 1
            }
        })
        .then(async () => {
            newProposal = newProposal.toJSON(); delete newProposal.__v;
            let listProposals = await ProposalSchema.find({ influencerID: body.influencerID }, { __v:0 });
            listProposals.reverse();
            res.json({
                success: true,
                newProposal, 
                listProposals
            });
        })
        .catch(err => { res.json(MongoErrorHandler(err)); });
    })
    .catch(err => { res.json(MongoErrorHandler(err)); });
}

export const UpdateProposalStatusHandler = async (req: Request, res: Response) => { 
    let body = req.body;
    if(req.params.id === "hire") {
        await ClientSchema.updateOne({ 'jobPostDetails._id': body.jobID }, {
            $inc: {
                'jobPostDetails.$.noOfHires': 1
            }
        })
        .then(async () => {
            await ProposalSchema.updateOne({ _id: body._id }, {
                $set: {
                    proposalStatus: "HIRED",
                    workStatus: "INPROGRESS"
                }
            })
            .then(() => {
                res.json({
                    success: true,
                });
            })
            .catch(err => { res.json(MongoErrorHandler(err)); });
        })
        .catch(err => { res.json(MongoErrorHandler(err)); });
    } else if(req.params.id === "reject") {
        await ProposalSchema.updateOne({ _id: body._id }, {
            $set: {
                proposalStatus: "REJECT"
            }
        })
        .then(() => {
            res.json({
                success: true,
            });
        })
        .catch(err => { res.json(MongoErrorHandler(err)); });
    } else if(req.params.id === "pay") {
        let body: any = req.body;
        let client = await ClientSchema.find({ 'jobPostDetails._id': body.jobID }, {creationDate: 0});
        let proposal = await ProposalSchema.find({ _id: body._id });
        await ProposalSchema.updateOne({ _id: body._id }, {
            $set: {
                proposalStatus: "PAID"
            }
        })
        .then(async () => {
            body.clientID = client[0].firebaseID;
            await ClientSchema.updateOne({firebaseID: body.clientID}, { $push: { expenseDetails: {
                influencerName: proposal[0].influencerName,
                username: proposal[0].username,
                profileLogo: proposal[0].profileImage,
                influencerID: proposal[0].influencerID,
                paymentValue: proposal[0].bidValue
            }}}, { new: true, returnDocument: 'after' });
            await InfluencerSchema.updateOne({firebaseID: proposal[0].influencerID}, { $push: { earningDetails: {
                country: client[0].location,
                companyLogo: client[0].brandLogo,
                companyName: client[0].companyName,
                earningValue: proposal[0].bidValue
            }}}, { new: true, returnDocument: 'after' });
            let newClient = await ClientSchema.find({ firebaseID: body.clientID }, {creationDate: 0});
            let latestExpense = [];
            if(newClient[0].expenseDetails.length !== 0) {
                latestExpense = newClient[0].expenseDetails;
                latestExpense = latestExpense[latestExpense.length - 1];
            }
            res.json({
                success: true,
                latestExpense,
            });
        })
        .catch(err => { res.json(MongoErrorHandler(err)); });
    } else if(req.params.id === "complete") {
        await ProposalSchema.updateOne({ _id: body._id }, {
            $set: {
                completedWorkLink: body.completedWorkLink,
                workStatus: "COMPLETED"
            }
        })
        .then(async () => {
            await ClientSchema.updateOne({ 'jobPostDetails._id': body.jobID }, {
                $inc: {
                    'jobPostDetails.$.noOfCompleted': 1
                }
            }).then(() => {
                res.json({
                    success: true,
                });
            })
        })
        .catch(err => { res.json(MongoErrorHandler(err)); });
    }
}

export const GetAllDetails = async (req: Request, res: Response) => {
    if(req.params.id === 'all') {
        let proposals = await ProposalSchema.find({ clientID: req.headers.clientid, jobID: req.headers.jobid, proposalStatus: 'REVIEW' });
        let hiredProposals = await ProposalSchema.find({ clientID: req.headers.clientid, jobID: req.headers.jobid}).where({ $or: [{ proposalStatus: 'HIRED' }, { workStatus: "COMPLETED" }] })
        let reviews = await ReviewSchema.find({});
        let pp: any = []
        let hp: any = []
        for(let prop of proposals) {
            let rating = 0, length = 0;
            reviews.map(rev => {
                if(rev.influencerID === prop.influencerID) {
                    rating = rev.reviewRating;
                    length++;
                }
            });
            if(length !== 0) rating = rating/length;
            prop = prop.toJSON();
            pp.push({
                _id: prop._id,
                jobID: prop.jobID,
                jobTitle: prop.jobTitle,
                clientID: prop.clientID,
                influencerName: prop.influencerName,
                profileImage: prop.profileImage,
                profileLink: prop.profileLink,
                location: prop.location,
                username: prop.username,
                influencerID: prop.influencerID,
                gender: prop.gender,
                age: prop.age,
                bidValue: prop.bidValue,
                bio: prop.bio,
                industry: prop.industry,
                subIndustry: prop.subIndustry,
                isVerified: prop.isVerified,
                proposalStatus: prop.proposalStatus,
                audienceSize: prop.audienceSize,
                completedWorkLink: prop.completedWorkLink,
                workStatus: prop.workStatus,
                upiID: prop.upiID,
                isPaid: false,
                rating: rating,
                __v: 0,
                postDate: prop.postDate,
            });
        }
        for(let prop of hiredProposals) {
            let rating = 0, length = 0, isPaid;
            reviews.map(rev => {
                if(rev.influencerID === prop.influencerID) {
                    rating = rev.reviewRating;
                    length++;
                }
            });
            if(length !== 0) rating = rating/length;
            prop = prop.toJSON();
            if(prop.proposalStatus === 'PAID') isPaid = true;
            hp.push({
                _id: prop._id,
                jobID: prop.jobID,
                jobTitle: prop.jobTitle,
                clientID: prop.clientID,
                influencerName: prop.influencerName,
                profileImage: prop.profileImage,
                profileLink: prop.profileLink,
                location: prop.location,
                username: prop.username,
                influencerID: prop.influencerID,
                gender: prop.gender,
                age: prop.age,
                bidValue: prop.bidValue,
                bio: prop.bio,
                industry: prop.industry,
                subIndustry: prop.subIndustry,
                isVerified: prop.isVerified,
                proposalStatus: prop.proposalStatus,
                audienceSize: prop.audienceSize,
                completedWorkLink: prop.completedWorkLink,
                workStatus: prop.workStatus,
                upiID: prop.upiID,
                isPaid,
                rating,
                __v: 0,
                postDate: prop.postDate,
            });
        }
        pp.reverse();
        hp.reverse();
        res.json({
            success: true,
            proposals: pp,
            hiredProposals: hp
        });
    } else if(req.params.id === 'hired') {
        let hiredProposals = await ProposalSchema.find({ clientID: req.headers.clientid, jobID: req.headers.jobid, proposalStatus: 'HIRED', workStatus: "INPROGRESS" }, { jobTitle: 0 });
        let completedProposals = await ProposalSchema.find({ clientID: req.headers.clientid, jobID: req.headers.jobid }).where({ $or: [{ workStatus: "COMPLETED" }, { proposalStatus: "PAID" }] });
        let reviews = await ReviewSchema.find({});
        let hp: any = []
        let cp: any = []
        for(let prop of hiredProposals) {
            let rating = 0, length = 0;
            reviews.map(rev => {
                if(rev.influencerID === prop.influencerID) {
                    rating = rev.reviewRating;
                    length++;
                }
            });
            if(length !== 0) rating = rating/length;
            prop = prop.toJSON();
            hp.push({
                _id: prop._id,
                jobID: prop.jobID,
                jobTitle: prop.jobTitle,
                clientID: prop.clientID,
                influencerName: prop.influencerName,
                profileImage: prop.profileImage,
                profileLink: prop.profileLink,
                location: prop.location,
                username: prop.username,
                influencerID: prop.influencerID,
                gender: prop.gender,
                age: prop.age,
                bidValue: prop.bidValue,
                bio: prop.bio,
                industry: prop.industry,
                subIndustry: prop.subIndustry,
                isVerified: prop.isVerified,
                proposalStatus: prop.proposalStatus,
                audienceSize: prop.audienceSize,
                completedWorkLink: prop.completedWorkLink,
                workStatus: prop.workStatus,
                upiID: prop.upiID,
                isPaid: false,
                rating: rating,
                __v: 0,
                postDate: prop.postDate,
            });
        }
        for(let prop of completedProposals) {
            let rating = 0, length = 0, isPaid = false;
            reviews.map(rev => {
                if(rev.influencerID === prop.influencerID) {
                    rating = rev.reviewRating;
                    length++;
                }
            });
            if(length !== 0) rating = rating/length;
            prop = prop.toJSON();
            if(prop.proposalStatus === 'PAID') isPaid = true;
            cp.push({
                _id: prop._id,
                jobID: prop.jobID,
                jobTitle: prop.jobTitle,
                clientID: prop.clientID,
                influencerName: prop.influencerName,
                profileImage: prop.profileImage,
                profileLink: prop.profileLink,
                location: prop.location,
                username: prop.username,
                influencerID: prop.influencerID,
                gender: prop.gender,
                age: prop.age,
                bidValue: prop.bidValue,
                bio: prop.bio,
                industry: prop.industry,
                subIndustry: prop.subIndustry,
                isVerified: prop.isVerified,
                proposalStatus: prop.proposalStatus,
                audienceSize: prop.audienceSize,
                completedWorkLink: prop.completedWorkLink,
                workStatus: prop.workStatus,
                upiID: prop.upiID,
                isPaid,
                rating,
                __v: 0,
                postDate: prop.postDate,
            });
        }
        hp.reverse();
        cp.reverse();
        res.json({
            success: true,
            hiredProposals: hp,
            completedProposals: cp
        });
    } else if(req.params.id === "detail") {
        let prop: any = await ProposalSchema.findOne({ _id: req.headers._id });
        prop = prop.toJSON();
        let reviews = await ReviewSchema.find({});
        let rating = 0, length = 0, isPaid = false;
        reviews.map(rev => {
            if(rev.influencerID === prop.influencerID) {
                rating = rev.reviewRating;
                length++;
            }
        });
        if(length !== 0) rating = rating/length;
        if(prop.proposalStatus === 'PAID') isPaid = true;
        let pp = {
            _id: prop._id,
            jobID: prop.jobID,
            jobTitle: prop.jobTitle,
            clientID: prop.clientID,
            influencerName: prop.influencerName,
            profileImage: prop.profileImage,
            profileLink: prop.profileLink,
            location: prop.location,
            username: prop.username,
            influencerID: prop.influencerID,
            gender: prop.gender,
            age: prop.age,
            bidValue: prop.bidValue,
            bio: prop.bio,
            industry: prop.industry,
            subIndustry: prop.subIndustry,
            isVerified: prop.isVerified,
            proposalStatus: prop.proposalStatus,
            audienceSize: prop.audienceSize,
            completedWorkLink: prop.completedWorkLink,
            workStatus: prop.workStatus,
            upiID: prop.upiID,
            isPaid,
            rating,
            __v: 0,
            postDate: prop.postDate,
        }
        res.json({
            success: true,
            proposal: pp
        });
    }
}