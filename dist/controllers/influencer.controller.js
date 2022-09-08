"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteInfluencerHandler = exports.IsCompleteInfluencerHandler = exports.GetJobsHandler = exports.GetAllDetails = exports.GetAllInfluencerDetails = exports.UpdateInfluencerSavedJobsHandler = exports.UpdateInfluencerHandler = exports.CreateInfluencerHandler = void 0;
const mongoError_service_1 = __importDefault(require("../services/mongoError.service"));
const influencer_model_1 = __importDefault(require("../models/influencer.model"));
const client_model_1 = __importDefault(require("../models/client.model"));
const underscore_1 = __importDefault(require("underscore"));
const proposal_model_1 = __importDefault(require("../models/proposal.model"));
const awsEmail_service_1 = require("../services/awsEmail.service");
require('dotenv').config();
const CreateInfluencerHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let body = req.body;
    let newInfluencer = new influencer_model_1.default(body);
    yield influencer_model_1.default.create(newInfluencer)
        .then(() => __awaiter(void 0, void 0, void 0, function* () {
        newInfluencer = newInfluencer.toJSON();
        yield (0, awsEmail_service_1.sendEmail)(newInfluencer, 'influencer');
        delete newInfluencer.__v;
        delete newInfluencer.creationDate;
        res.json({
            success: true,
            influencer: newInfluencer
        });
    }))
        .catch(err => { res.json((0, mongoError_service_1.default)(err)); });
});
exports.CreateInfluencerHandler = CreateInfluencerHandler;
const UpdateInfluencerHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let prevInfluencer = yield influencer_model_1.default.findOne({ firebaseID: req.body.firebaseID });
        let name = prevInfluencer.name, profileLink = prevInfluencer.profileLink, location = prevInfluencer.location, state = prevInfluencer.state, city = prevInfluencer.city, influencerLogo = prevInfluencer.influencerLogo, influencerLogoKey = prevInfluencer.influencerLogoKey, username = prevInfluencer.username, gender = prevInfluencer.gender, age = prevInfluencer.age, bio = prevInfluencer.bio, industry = prevInfluencer.industry, subIndustry = prevInfluencer.subIndustry, upiID = prevInfluencer.upiID, audienceSize = prevInfluencer.audienceSize, savedJobsID = prevInfluencer.savedJobsID, platform = prevInfluencer.platform, platformLogo = prevInfluencer.platformLogo;
        if (req.body.name !== undefined)
            name = req.body.name;
        if (req.body.profileLink !== undefined)
            profileLink = req.body.profileLink;
        if (req.body.location !== undefined)
            location = req.body.location;
        if (req.body.state !== undefined)
            state = req.body.state;
        if (req.body.city !== undefined)
            city = req.body.city;
        if (req.body.gender !== undefined)
            gender = req.body.gender;
        if (req.body.age !== undefined)
            age = req.body.age;
        if (req.body.bio !== undefined)
            bio = req.body.bio;
        if (req.body.upiID !== undefined)
            upiID = req.body.upiID;
        if (req.body.industry !== undefined)
            industry = req.body.industry;
        if (req.body.subIndustry !== undefined)
            subIndustry = req.body.subIndustry.split(",");
        if (req.body.audienceSize !== undefined)
            audienceSize = req.body.audienceSize;
        if (req.body.savedJobsID !== undefined)
            savedJobsID = req.body.savedJobsID;
        if (req.body.platform !== undefined) {
            platform = req.body.platform;
            platformLogo = `https://dropdown-files.s3.us-west-2.amazonaws.com/logos/${platform}.svg`;
        }
        if (req.body.username !== undefined) {
            username = req.body.username;
        }
        if (platform !== null && username !== null)
            profileLink = `https://${platform.toLowerCase()}.com/${username}`;
        if (req.body.influencerLogo !== undefined)
            influencerLogo = req.body.influencerLogo;
        yield influencer_model_1.default.updateOne({ firebaseID: req.body.firebaseID }, {
            $set: {
                name, profileLink, location, state, city, username, gender, age, bio, upiID,
                industry, subIndustry, audienceSize, savedJobsID,
                influencerLogo: req.body.influencerLogo || influencerLogo,
                influencerLogoKey, platform, platformLogo
            }
        })
            .then(() => __awaiter(void 0, void 0, void 0, function* () {
            let newInfluencer = yield influencer_model_1.default.findOne({ firebaseID: req.body.firebaseID }, { savedJobsID: 0, earningDetails: 0, __v: 0, creationDate: 0 });
            yield proposal_model_1.default.updateMany({ influencerID: req.body.firebaseID }, {
                $set: {
                    influencerName: name, profileImage: influencerLogo, profileLink,
                    upiID, location, username, gender, age, bio, industry, subIndustry
                }
            });
            res.json({
                success: true,
                influencer: newInfluencer
            });
        }))
            .catch(err => { res.json((0, mongoError_service_1.default)(err)); });
    }
    catch (e) {
        console.log(e),
            res.json({
                success: false,
            });
    }
});
exports.UpdateInfluencerHandler = UpdateInfluencerHandler;
const UpdateInfluencerSavedJobsHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.params.id === "remove") {
        let updatedInfluencer = yield influencer_model_1.default.updateOne({ firebaseID: req.body.firebaseID }, { $pull: { 'savedJobsID': req.body.jobID } }, { new: true, returnDocument: 'after' });
        if (updatedInfluencer.acknowledged === true) {
            res.json({
                success: true,
            });
        }
        else {
            res.json({
                success: false,
            });
        }
    }
    else if (req.params.id === "save") {
        let updatedInfluencer = yield influencer_model_1.default.updateOne({ firebaseID: req.body.firebaseID }, { $push: { 'savedJobsID': req.body.jobID } }, { new: true, returnDocument: 'after' });
        if (updatedInfluencer.acknowledged === true) {
            res.json({
                success: true,
            });
        }
        else {
            res.json({
                success: false,
            });
        }
    }
});
exports.UpdateInfluencerSavedJobsHandler = UpdateInfluencerSavedJobsHandler;
const GetAllInfluencerDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let allInfluencers = yield influencer_model_1.default.find({}, { creationDate: 0 });
        if (allInfluencers.length === 0)
            throw "Influencers empty";
        res.json({
            success: true,
            allInfluencers
        });
    }
    catch (e) {
        console.log(e),
            res.json({
                success: false,
            });
    }
});
exports.GetAllInfluencerDetails = GetAllInfluencerDetails;
const GetAllDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let influencer = yield influencer_model_1.default.find({ firebaseID: req.headers.firebaseid }, { creationDate: 0 });
        if (influencer.length === 0)
            throw "No Influencer present by that ID";
        if (req.params.id === "all") {
            let proposals = yield proposal_model_1.default.find({ influencerID: req.headers.firebaseid });
            let newinlf = influencer[0];
            newinlf.toJSON();
            delete newinlf.creationDate;
            proposals.reverse();
            res.json({
                success: true,
                influencer: newinlf,
                proposals
            });
        }
        else if (req.params.id === "proposal") {
            let proposals = yield proposal_model_1.default.find({ influencerID: req.headers.firebaseid });
            proposals.reverse();
            res.json({
                success: true,
                proposals
            });
        }
        else if (req.params.id === "earning") {
            let totalEarnings = 0;
            let earnings = influencer[0].earningDetails;
            earnings.map((earning) => totalEarnings += parseInt(earning.earningValue));
            earnings.reverse();
            res.json({
                success: true,
                earnings,
                totalEarnings
            });
        }
    }
    catch (e) {
        console.log(e),
            res.json({
                success: false,
            });
    }
});
exports.GetAllDetails = GetAllDetails;
const GetJobsHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let clients = yield client_model_1.default.find({}, { jobPostDetails: 1 });
    let jobs = [];
    clients.map((client) => {
        jobs = [...jobs, client.jobPostDetails];
    });
    let allJobsin1d = underscore_1.default.flatten(jobs);
    if (req.params.id === 'log') {
        allJobsin1d.reverse();
        let aJs = [];
        for (let job of allJobsin1d) {
            job = job.toJSON();
            job.saved = false;
            aJs.push(job);
        }
        ;
        res.json({
            success: true,
            jobs: aJs,
        });
    }
    else if (req.params.id === 'jobdetail' && (req.headers.firebaseid === null || req.headers.firebaseid === undefined || req.headers.firebaseid === "null")) {
        let job;
        allJobsin1d.forEach((jobs) => {
            if (req.headers.jobid === jobs._id.toString()) {
                job = jobs;
            }
        });
        let editedJob = {
            firebaseID: job.firebaseID,
            companyName: job.companyName,
            brandLogo: job.brandLogo,
            platformLogo: job.platformLogo,
            jobTitle: job.jobTitle,
            platformChoice: job.platformChoice,
            industry: job.industry,
            subIndustry: job.subIndustry,
            campaignLocation: job.campaignLocation,
            campaignState: job.campaignState,
            campaignCity: job.campaignCity,
            budgetType: job.budgetType,
            budget: job.budget,
            othersType: job.budget,
            othersDescription: job.othersDescription,
            task: job.task,
            description: job.description,
            status: job.status,
            postDate: job.postDate,
            gender: job.gender,
            age: job.age,
            audienceSize: job.audienceSize,
            noOfInfluencers: job.noOfInfluencers,
            noOfProposals: job.noOfProposals,
            noOfHires: job.noOfHires,
            noOfCompleted: job.noOfCompleted,
            campaignDate: job.campaignDate,
            campaignTime: job.campaignTime,
            _id: job._id,
            applied: false,
            saved: false
        };
        res.json({
            success: true,
            jobs: editedJob
        });
    }
    else {
        let influencer = yield influencer_model_1.default.findOne({ firebaseID: req.headers.firebaseid }, { creationDate: 0 });
        let savedJobsIDList = influencer.savedJobsID;
        let savedJobs = [];
        savedJobsIDList.forEach((jobID) => {
            allJobsin1d.forEach(job => {
                if (jobID === job._id.toString()) {
                    savedJobs = [...savedJobs, job];
                }
            });
        });
        let proposal = yield proposal_model_1.default.find({ influencerID: req.headers.firebaseid }).where({ $or: [{ proposalStatus: "REVIEW" }, { proposalStatus: "REJECT" }, { proposalStatus: "PAID" }, { proposalStatus: "HIRED" }] });
        let appliedJobIDList = proposal;
        let appliedJobs = [];
        appliedJobIDList.forEach((appliedJob) => {
            allJobsin1d.forEach(job => {
                if (appliedJob.jobID === job._id.toString()) {
                    appliedJobs.push(job);
                }
            });
        });
        let aJs = [];
        let allJobswithOutSave = [];
        for (let job of allJobsin1d) {
            let flag = false;
            job = job.toJSON();
            appliedJobs.forEach((appliedJob) => {
                if (appliedJob._id.toString() === job._id.toString()) {
                    flag = true;
                }
            });
            if (flag === false && job.status === 'ACTIVE') {
                job.applied = false;
                aJs.push(job);
                allJobswithOutSave.push(job);
            }
            else if (flag && job.status === 'ACTIVE') {
                job.applied = true;
                aJs.push(job);
            }
        }
        ;
        for (let job of aJs) {
            let flag = false;
            for (const jobID of savedJobsIDList) {
                if (jobID === job._id.toString()) {
                    flag = true;
                    break;
                }
            }
            if (flag) {
                job.saved = true;
            }
            else {
                job.saved = false;
            }
        }
        if (req.params.id === 'all') {
            let platform = '', location = '', industry = '', budgetType = '', audiencesize = '';
            if (influencer.location !== null)
                location = influencer.location;
            if (req.headers.platform !== undefined)
                platform = req.headers.platform;
            if (req.headers.location !== undefined)
                location = req.headers.location;
            if (req.headers.industry !== undefined)
                industry = req.headers.industry;
            if (req.headers.budgettype !== undefined)
                budgetType = req.headers.budgetType;
            if (req.headers.audiencesize !== undefined)
                audiencesize = req.headers.audiencesize;
            let filteredJobs = [], unfilteredJobs = [];
            allJobswithOutSave.forEach((job) => {
                if ((job.platformChoice !== null &&
                    (job.platformChoice.indexOf(platform) === 0)) &&
                    (job.campaignLocation !== null &&
                        (job.campaignLocation.indexOf(location) === 0)) &&
                    (job.industry !== null &&
                        (job.industry.indexOf(industry) === 0)) &&
                    (job.budgetType !== null &&
                        (job.budgetType.indexOf(budgetType) === 0))) {
                    if (job.audienceSize !== null &&
                        job.audienceSize.indexOf(audiencesize) === 0)
                        filteredJobs.push(job);
                }
                if ((job.campaignLocation !== null &&
                    job.campaignLocation.toLowerCase() === 'worldwide')) {
                    console.log('first');
                    unfilteredJobs.push(job);
                }
            });
            filteredJobs.reverse();
            unfilteredJobs.reverse();
            let f_and_uf_jobs = [...filteredJobs, ...unfilteredJobs];
            res.json({
                success: true,
                jobs: f_and_uf_jobs
            });
        }
        else if (req.params.id === 'saved') {
            let savedJobs = [];
            for (const job of aJs) {
                if (job.saved === true && job.applied === false)
                    savedJobs.push(job);
            }
            savedJobs.reverse();
            res.json({
                success: true,
                jobs: savedJobs,
            });
        }
        else if (req.params.id === 'hired') {
            let hiredJob = yield proposal_model_1.default.find({ influencerID: req.headers.firebaseid }).where({ proposalStatus: "HIRED", workStatus: "INPROGRESS" });
            let hiredJobIDList = hiredJob;
            let hiredJobs = [];
            hiredJobIDList.forEach((hiredJob) => {
                allJobsin1d.forEach((job) => {
                    if (hiredJob.jobID === job._id.toString()) {
                        hiredJobs.push({
                            _id: hiredJob._id,
                            jobID: hiredJob.jobID,
                            jobTitle: hiredJob.jobTitle,
                            clientID: hiredJob.clientID,
                            bidValue: hiredJob.bidValue,
                            proposalStatus: hiredJob.proposalStatus,
                            companyName: job.companyName,
                            brandLogo: job.brandLogo,
                            platformLogo: job.platformLogo,
                            platformChoice: job.platformChoice,
                            campaignLocation: job.campaignLocation,
                            campaignState: job.campaignState,
                            campaignCity: job.campaignCity,
                            task: job.task,
                            description: job.description,
                            industry: job.industry,
                            subIndustry: job.subIndustry,
                            campaignDate: job.campaignDate,
                            campaignTime: job.campaignTime,
                            // proposal: hiredJob,
                            // job: job,
                        });
                    }
                });
            });
            hiredJobs.reverse();
            res.json({
                success: true,
                jobs: hiredJobs
            });
        }
        else if (req.params.id === 'completed') {
            let completedJob = yield proposal_model_1.default.find({ influencerID: req.headers.firebaseid }).where({ $or: [{ proposalStatus: "PAID" }, { workStatus: "COMPLETED" }] });
            let completedJobIDList = completedJob;
            let completedJobs = [];
            completedJobIDList.forEach((completedJob) => {
                allJobsin1d.forEach((job) => {
                    if (completedJob.jobID === job._id.toString()) {
                        let isPaid = false;
                        if (completedJob.proposalStatus === "PAID")
                            isPaid = true;
                        completedJobs.push({
                            _id: completedJob._id,
                            jobID: completedJob.jobID,
                            jobTitle: completedJob.jobTitle,
                            clientID: completedJob.clientID,
                            bidValue: completedJob.bidValue,
                            proposalStatus: completedJob.proposalStatus,
                            isPaid,
                            companyName: job.companyName,
                            brandLogo: job.brandLogo,
                            platformLogo: job.platformLogo,
                            platformChoice: job.platformChoice,
                            campaignLocation: job.campaignLocation,
                            campaignState: job.campaignState,
                            campaignCity: job.campaignCity,
                            task: job.task,
                            description: job.description,
                            industry: job.industry,
                            subIndustry: job.subIndustry,
                            campaignDate: job.campaignDate,
                            campaignTime: job.campaignTime,
                        });
                    }
                });
            });
            completedJobs.reverse();
            res.json({
                success: true,
                jobs: completedJobs
            });
        }
        else if (req.params.id === 'jobdetail') {
            let job;
            let savedFlag = false, appliedFlag = true;
            let po = yield proposal_model_1.default.findOne({ influencerID: req.headers.firebaseid, jobID: req.headers.jobid });
            allJobsin1d.forEach((jobs) => {
                if (req.headers.jobid === jobs._id.toString()) {
                    job = jobs;
                }
            });
            if (job === undefined) {
                res.json({
                    sucees: false,
                    error: "Deleted Job"
                });
            }
            else {
                allJobswithOutSave.forEach((savedJob) => {
                    if (savedJob._id.toString() === req.headers.jobid) {
                        savedFlag = true;
                        return;
                    }
                });
                if (po === null) {
                    appliedFlag = false;
                }
                let editedJob = {
                    firebaseID: job.firebaseID,
                    companyName: job.companyName,
                    brandLogo: job.brandLogo,
                    platformLogo: job.platformLogo,
                    jobTitle: job.jobTitle,
                    platformChoice: job.platformChoice,
                    industry: job.industry,
                    subIndustry: job.subIndustry,
                    campaignLocation: job.campaignLocation,
                    campaignState: job.campaignState,
                    campaignCity: job.campaignCity,
                    budgetType: job.budgetType,
                    budget: job.budget,
                    othersType: job.budget,
                    othersDescription: job.othersDescription,
                    task: job.task,
                    description: job.description,
                    status: job.status,
                    postDate: job.postDate,
                    gender: job.gender,
                    age: job.age,
                    audienceSize: job.audienceSize,
                    noOfInfluencers: job.noOfInfluencers,
                    noOfProposals: job.noOfProposals,
                    noOfHires: job.noOfHires,
                    noOfCompleted: job.noOfCompleted,
                    campaignDate: job.campaignDate,
                    campaignTime: job.campaignTime,
                    _id: job._id,
                    applied: appliedFlag,
                    saved: savedFlag
                };
                res.json({
                    success: true,
                    jobs: editedJob
                });
            }
        }
        else if (req.params.id === 'applied') {
            let proposals = yield proposal_model_1.default.find({ influencerID: req.headers.firebaseid }, { bidValue: 1, jobTitle: 1, jobID: 1, clientID: 1, postDate: 1 });
            let appliedProposals = [];
            for (let proposal of proposals) {
                let filteredJob = appliedJobs.filter((job) => proposal.jobID === job._id.toString());
                appliedProposals.push({
                    _id: proposal._id,
                    jobID: proposal.jobID,
                    jobTitle: proposal.jobTitle,
                    bidValue: proposal.bidValue,
                    clientID: proposal.clientID,
                    appliedDate: proposal.postDate,
                    companyName: filteredJob.companyName,
                    platformChoice: filteredJob.platformChoice,
                    brandLogo: filteredJob.brandLogo,
                    campaignLocation: filteredJob.campaignLocation,
                    campaignState: filteredJob.campaignState,
                    campaignCity: filteredJob.campaignCity
                });
            }
            ;
            appliedProposals.reverse();
            res.json({
                success: true,
                proposals: appliedProposals
            });
        }
    }
});
exports.GetJobsHandler = GetJobsHandler;
const IsCompleteInfluencerHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let influencer = yield influencer_model_1.default.findOne({ firebaseID: req.headers.firebaseid }, { earningDetails: 0, savedJobsID: 0, _id: 0, __v: 0, creationDate: 0 });
    if (influencer.name === null || influencer.influencerLogo === null || influencer.profileLink === null ||
        influencer.location === null || influencer.username === null || influencer.gender === null ||
        influencer.age === null || influencer.bio === null || influencer.upiID === null ||
        influencer.industry === null || influencer.subIndustry === null || influencer.audienceSize === null) {
        res.json({
            success: false
        });
    }
    else {
        res.json({
            success: true
        });
    }
});
exports.IsCompleteInfluencerHandler = IsCompleteInfluencerHandler;
const DeleteInfluencerHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let deleteClient = yield influencer_model_1.default.deleteOne({ firebaseID: req.body.firebaseID });
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
    }
    catch (e) {
        console.log(e);
        return res.json({
            success: false
        });
    }
});
exports.DeleteInfluencerHandler = DeleteInfluencerHandler;
