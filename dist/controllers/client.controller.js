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
exports.DeleteClientHandler = exports.GetAllDetails = exports.GetAllClientDetails = exports.UpdateClientHandler = exports.CloseJobHandler = exports.UpdateJobHandler = exports.PostJobHandler = exports.CreateClientHandler = void 0;
const mongoError_service_1 = __importDefault(require("../services/mongoError.service"));
const client_model_1 = __importDefault(require("../models/client.model"));
const influencer_model_1 = __importDefault(require("../models/influencer.model"));
const review_model_1 = __importDefault(require("../models/review.model"));
const awsEmail_service_1 = require("../services/awsEmail.service");
require('dotenv').config();
const CreateClientHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let body = req.body;
    let newClient = new client_model_1.default(body);
    yield client_model_1.default.create(newClient)
        .then(() => __awaiter(void 0, void 0, void 0, function* () {
        newClient = newClient.toJSON();
        yield (0, awsEmail_service_1.sendEmail)(newClient, 'client');
        delete newClient.__v;
        delete newClient.creationDate;
        res.json({
            success: true,
            client: newClient
        });
    }))
        .catch(err => { res.json((0, mongoError_service_1.default)(err)); });
});
exports.CreateClientHandler = CreateClientHandler;
const PostJobHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (typeof (req.body) === 'string')
            req.body = JSON.parse(req.body);
        let firebaseID = req.body.firebaseID;
        req.body.platformLogo = `https://dropdown-files.s3.us-west-2.amazonaws.com/logos/${(_a = (req.body.platformChoice)) === null || _a === void 0 ? void 0 : _a.toLocaleLowerCase()}.png`;
        try {
            var client = yield client_model_1.default.findOne({ firebaseID });
            req.body.brandLogo = client.brandLogo, req.body.companyName = client.companyName;
        }
        catch (e) {
            console.log(e);
            let successflag = JSON.stringify({
                success: false,
            });
            res.send(successflag);
        }
        let sI;
        if (req.body.subIndustry === undefined) {
            sI = [];
        }
        else {
            sI = req.body.subIndustry.split(",");
        }
        let request_body = Object.assign(Object.assign({}, req.body), { subIndustry: sI });
        var updatedClient = yield client_model_1.default.updateOne({ firebaseID }, { $push: { jobPostDetails: request_body } }, { new: true, returnDocument: 'after' });
        var newClient = yield client_model_1.default.findOne({ firebaseID });
        newClient = newClient.toJSON();
        delete newClient.creationDate;
        for (let job of newClient.jobPostDetails) {
            job.noOfCompleted = job.noOfCompleted.toString();
            job.noOfProposals = job.noOfProposals.toString();
            job.noOfHires = job.noOfHires.toString();
        }
        let latestJob = newClient.jobPostDetails;
        latestJob = latestJob[latestJob.length - 1];
        newClient.jobPostDetails.reverse();
        if (updatedClient.acknowledged === true) {
            res.json({
                success: true,
                jobList: newClient.jobPostDetails,
                latestJob: latestJob
            });
        }
        else {
            res.send({
                success: false,
            });
        }
    }
    catch (err) {
        console.log(err), res.json(err);
    }
    ;
});
exports.PostJobHandler = PostJobHandler;
const UpdateJobHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        let id = req.body._id, latestJob;
        let request_body = req.body;
        let client = yield client_model_1.default.findOne({ 'jobPostDetails._id': id }, { creationDate: 0 });
        let job = yield client_model_1.default.findOne({ firebaseID: client.firebaseID }, { _id: 0, jobPostDetails: { $elemMatch: { _id: id } } });
        job = job.jobPostDetails[0];
        if (request_body.firebaseID == undefined)
            request_body.firebaseID = job.firebaseID;
        if (request_body.companyName == undefined)
            request_body.companyName = job.companyName;
        if (request_body.brandLogo == undefined)
            request_body.brandLogo = job.brandLogo;
        if (request_body.platformLogo == undefined)
            request_body.platformLogo = job.platformLogo;
        if (request_body.jobTitle == undefined)
            request_body.jobTitle = job.jobTitle;
        if (request_body.platformChoice == undefined)
            request_body.platformChoice = job.platformChoice;
        if (request_body.industry == undefined)
            request_body.industry = job.industry;
        if (request_body.subIndustry == undefined) {
            request_body.subIndustry = job.subIndustry;
        }
        else {
            request_body.subIndustry = request_body.subIndustry.split(",");
        }
        if (request_body.campaignLocation == undefined)
            request_body.campaignLocation = job.campaignLocation;
        if (request_body.campaignState == undefined)
            request_body.campaignState = job.campaignState;
        if (request_body.campaignCity == undefined)
            request_body.campaignCity = job.campaignCity;
        if (request_body.budgetType == undefined)
            request_body.budgetType = job.budgetType;
        if (request_body.budget == undefined)
            request_body.budget = job.budget;
        if (request_body.othersType == undefined)
            request_body.othersType = job.othersType;
        if (request_body.othersDescription == undefined)
            request_body.othersDescription = job.othersDescription;
        if (request_body.task == undefined)
            request_body.task = job.task;
        if (request_body.description == undefined)
            request_body.description = job.description;
        if (request_body.status == undefined)
            request_body.status = job.status;
        if (request_body.postDate == undefined)
            request_body.postDate = job.postDate;
        if (request_body.age == undefined)
            request_body.age = job.age;
        if (request_body.gender == undefined)
            request_body.gender = job.gender;
        if (request_body.audienceSize == undefined)
            request_body.audienceSize = job.audienceSize;
        if (request_body.noOfInfluencers == undefined)
            request_body.noOfInfluencers = job.noOfInfluencers;
        if (request_body.noOfProposals == undefined)
            request_body.noOfProposals = job.noOfProposals;
        if (request_body.noOfHires == undefined)
            request_body.noOfHires = job.noOfHires;
        if (request_body.noOfCompleted == undefined)
            request_body.noOfCompleted = job.noOfCompleted;
        if (request_body.campaignDate == undefined)
            request_body.campaignDate = job.campaignDate;
        if (request_body.campaignTime == undefined)
            request_body.campaignTime = job.campaignTime;
        request_body.platformLogo = `https://dropdown-files.s3.us-west-2.amazonaws.com/logos/${(_b = (request_body.platformChoice)) === null || _b === void 0 ? void 0 : _b.toLocaleLowerCase()}.png`;
        let updatedClient = yield client_model_1.default.updateOne({ 'jobPostDetails._id': id }, {
            $set: {
                'jobPostDetails.$': request_body
            }
        }, { new: true });
        let newClient = yield client_model_1.default.findOne({ 'jobPostDetails._id': id }, { creationDate: 0 });
        for (let job of newClient.jobPostDetails) {
            job.noOfCompleted = job.noOfCompleted.toString();
            job.noOfProposals = job.noOfProposals.toString();
            job.noOfHires = job.noOfHires.toString();
        }
        newClient.jobPostDetails.reverse();
        latestJob = newClient.jobPostDetails.find((job) => job._id == id);
        if (updatedClient.acknowledged === true) {
            res.json({
                success: true,
                jobList: newClient.jobPostDetails,
                latestJob
            });
        }
        else {
            res.json({
                success: false,
            });
        }
    }
    catch (err) {
        console.log(err), res.json(err);
    }
    ;
});
exports.UpdateJobHandler = UpdateJobHandler;
const CloseJobHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let updatedClient = yield client_model_1.default.updateOne({ 'jobPostDetails._id': req.body._id }, {
        $set: {
            'jobPostDetails.$.status': "CLOSED"
        }
    }, { new: true });
    if (updatedClient.acknowledged === true) {
        res.json({
            success: true
        });
    }
    else {
        res.json({
            success: false
        });
    }
});
exports.CloseJobHandler = CloseJobHandler;
const UpdateClientHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let prevClient = yield client_model_1.default.findOne({ firebaseID: req.body.firebaseID }, { jobPostDetails: 0, expenseDetails: 0, __v: 0, creationDate: 0 });
        let name = prevClient.name, companyName = prevClient.companyName, websiteLink = prevClient.websiteLink, location = prevClient.location, brandLogo = prevClient.brandLogo, brandLogoKey = prevClient.brandLogoKey;
        if (req.body.name !== undefined)
            name = req.body.name;
        if (req.body.companyName !== undefined)
            companyName = req.body.companyName;
        if (req.body.websiteLink !== undefined)
            websiteLink = req.body.websiteLink;
        if (req.body.location !== undefined)
            location = req.body.location;
        if (req.body.brandLogo !== undefined)
            brandLogo = req.body.brandLogo;
        console.log(req.body.brandLogo);
        yield client_model_1.default.updateOne({ firebaseID: req.body.firebaseID }, {
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
            .then(() => __awaiter(void 0, void 0, void 0, function* () {
            let newClient = yield client_model_1.default.findOne({ firebaseID: req.body.firebaseID }, { 'jobPostDetails.companyName': 0, 'jobPostDetails.brandLogo': 0, creationDate: 0 });
            res.json({
                success: true,
                client: newClient
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
exports.UpdateClientHandler = UpdateClientHandler;
const GetAllClientDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let allClient = yield client_model_1.default.find({}, { 'jobPostDetails.companyName': 0, 'jobPostDetails.brandLogo': 0, creationDate: 0 });
        if (allClient.length === 0)
            throw "Clients empty";
        res.json({
            success: true,
            allClient,
        });
    }
    catch (e) {
        console.log(e),
            res.json({
                success: false,
            });
    }
});
exports.GetAllClientDetails = GetAllClientDetails;
const GetAllDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.params.id === "influencer") {
            let influencer = yield influencer_model_1.default.findOne({ firebaseID: req.headers.influencerid }, { _id: 0, __v: 0, earningDetails: 0, savedJobsID: 0, upiID: 0 });
            influencer = influencer.toJSON();
            delete influencer.creationDate;
            let reviews = yield review_model_1.default.find({ influencerID: req.headers.influencerid }, { _id: 0, __v: 0 });
            res.json({
                success: true,
                influencer,
                reviews
            });
        }
        else {
            let firebaseID = req.headers.firebaseid;
            let client = yield client_model_1.default.find({ firebaseID });
            let newClient = client[0];
            newClient = newClient.toJSON();
            delete newClient.creationDate;
            if (client.length === 0 && req.params.id !== "influencer")
                throw "No Client present by that ID";
            if (req.params.id === "all") {
                res.json({
                    success: true,
                    client: newClient,
                });
            }
            else if (req.params.id === "jobdetail") {
                let job = yield client_model_1.default.find({ firebaseID }, { jobPostDetails: { $elemMatch: { _id: req.headers._id } } });
                res.json({
                    success: true,
                    job: job[0].jobPostDetails[0]
                });
            }
            else if (req.params.id === "job") {
                let activeJobs = [];
                let closedJobs = [];
                client[0].jobPostDetails.map((job) => {
                    if (job.status === 'ACTIVE')
                        activeJobs.push(job);
                    else
                        closedJobs.push(job);
                });
                activeJobs.reverse();
                closedJobs.reverse();
                res.json({
                    success: true,
                    activeJobs,
                    closedJobs
                });
            }
            else if (req.params.id === "hiredjob") {
                let jobPostDetails = client[0].jobPostDetails.filter((job) => job.noOfHires >= 1);
                jobPostDetails.reverse();
                res.json({
                    success: true,
                    jobs: jobPostDetails
                });
            }
            else if (req.params.id === "completedjob") {
                let jobPostDetails = client[0].jobPostDetails.filter((job) => job.noOfCompleted >= 1);
                jobPostDetails.reverse();
                res.json({
                    success: true,
                    jobs: jobPostDetails
                });
            }
            else if (req.params.id === "closedjob") {
                let jobPostDetails = client[0].jobPostDetails.filter((job) => job.status === "CLOSED");
                jobPostDetails.reverse();
                res.json({
                    success: true,
                    jobs: jobPostDetails
                });
            }
            else if (req.params.id === "expense") {
                let totalExpense = 0;
                let expenses = client[0].expenseDetails;
                expenses.map((expense) => {
                    if (parseInt(expense.paymentValue) !== -1)
                        totalExpense += parseInt(expense.paymentValue);
                });
                expenses.reverse();
                res.json({
                    success: true,
                    expenses,
                    totalExpense
                });
            }
            else {
                res.json({
                    success: false,
                });
            }
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
const DeleteClientHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let firebaseID = req.headers.firebaseid;
        let deleteClient = yield client_model_1.default.deleteOne({ firebaseID });
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
exports.DeleteClientHandler = DeleteClientHandler;
