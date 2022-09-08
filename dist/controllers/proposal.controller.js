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
exports.GetAllDetails = exports.UpdateProposalStatusHandler = exports.CreateProposalHandler = void 0;
const mongoError_service_1 = __importDefault(require("../services/mongoError.service"));
const proposal_model_1 = __importDefault(require("../models/proposal.model"));
const client_model_1 = __importDefault(require("../models/client.model"));
const influencer_model_1 = __importDefault(require("../models/influencer.model"));
const review_model_1 = __importDefault(require("../models/review.model"));
const CreateProposalHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let body = req.body;
    let client = yield client_model_1.default.findOne({ 'jobPostDetails._id': body.jobID });
    let influencer = yield influencer_model_1.default.findOne({ firebaseID: req.body.influencerID }, { creationDate: 0 });
    body.clientID = client.firebaseID;
    body.companyName = client.companyName;
    body.brandLogo = client.brandLogo;
    for (const job of client.jobPostDetails) {
        if (job._id.toString() === body.jobID) {
            body.jobTitle = job.jobTitle;
            break;
        }
    }
    body.age = influencer.age, body.bio = influencer.bio, body.gender = influencer.gender,
        body.industry = influencer.industry, body.influencerName = influencer.name, body.isVerified = influencer.isVerified,
        body.location = influencer.location, body.profileImage = influencer.influencerLogo, body.profileLink = influencer.profileLink,
        body.subIndustry = influencer.subIndustry, body.upiID = influencer.upiID, body.username = influencer.username,
        body.audienceSize = influencer.audienceSize;
    if (body.profileImage === null)
        body.profileImage = "NA";
    if (body.profileLink === null)
        body.profileLink = "NA";
    let newProposal = new proposal_model_1.default(body);
    yield proposal_model_1.default.create(newProposal)
        .then(() => __awaiter(void 0, void 0, void 0, function* () {
        yield client_model_1.default.updateOne({ 'jobPostDetails._id': body.jobID }, {
            $inc: {
                'jobPostDetails.$.noOfProposals': 1
            }
        })
            .then(() => __awaiter(void 0, void 0, void 0, function* () {
            newProposal = newProposal.toJSON();
            delete newProposal.__v;
            let listProposals = yield proposal_model_1.default.find({ influencerID: body.influencerID }, { __v: 0 });
            listProposals.reverse();
            res.json({
                success: true,
                newProposal,
                listProposals
            });
        }))
            .catch(err => { res.json((0, mongoError_service_1.default)(err)); });
    }))
        .catch(err => { res.json((0, mongoError_service_1.default)(err)); });
});
exports.CreateProposalHandler = CreateProposalHandler;
const UpdateProposalStatusHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let body = req.body;
    if (req.params.id === "hire") {
        yield client_model_1.default.updateOne({ 'jobPostDetails._id': body.jobID }, {
            $inc: {
                'jobPostDetails.$.noOfHires': 1
            }
        })
            .then(() => __awaiter(void 0, void 0, void 0, function* () {
            yield proposal_model_1.default.updateOne({ _id: body._id }, {
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
                .catch(err => { res.json((0, mongoError_service_1.default)(err)); });
        }))
            .catch(err => { res.json((0, mongoError_service_1.default)(err)); });
    }
    else if (req.params.id === "reject") {
        yield proposal_model_1.default.updateOne({ _id: body._id }, {
            $set: {
                proposalStatus: "REJECT"
            }
        })
            .then(() => {
            res.json({
                success: true,
            });
        })
            .catch(err => { res.json((0, mongoError_service_1.default)(err)); });
    }
    else if (req.params.id === "pay") {
        let body = req.body;
        let client = yield client_model_1.default.find({ 'jobPostDetails._id': body.jobID }, { creationDate: 0 });
        let proposal = yield proposal_model_1.default.find({ _id: body._id });
        yield proposal_model_1.default.updateOne({ _id: body._id }, {
            $set: {
                proposalStatus: "PAID"
            }
        })
            .then(() => __awaiter(void 0, void 0, void 0, function* () {
            body.clientID = client[0].firebaseID;
            yield client_model_1.default.updateOne({ firebaseID: body.clientID }, { $push: { expenseDetails: {
                        influencerName: proposal[0].influencerName,
                        username: proposal[0].username,
                        profileLogo: proposal[0].profileImage,
                        influencerID: proposal[0].influencerID,
                        paymentValue: proposal[0].bidValue
                    } } }, { new: true, returnDocument: 'after' });
            yield influencer_model_1.default.updateOne({ firebaseID: proposal[0].influencerID }, { $push: { earningDetails: {
                        country: client[0].location,
                        companyLogo: client[0].brandLogo,
                        companyName: client[0].companyName,
                        earningValue: proposal[0].bidValue
                    } } }, { new: true, returnDocument: 'after' });
            let newClient = yield client_model_1.default.find({ firebaseID: body.clientID }, { creationDate: 0 });
            let latestExpense = [];
            if (newClient[0].expenseDetails.length !== 0) {
                latestExpense = newClient[0].expenseDetails;
                latestExpense = latestExpense[latestExpense.length - 1];
            }
            res.json({
                success: true,
                latestExpense,
            });
        }))
            .catch(err => { res.json((0, mongoError_service_1.default)(err)); });
    }
    else if (req.params.id === "complete") {
        yield proposal_model_1.default.updateOne({ _id: body._id }, {
            $set: {
                completedWorkLink: body.completedWorkLink,
                workStatus: "COMPLETED"
            }
        })
            .then(() => __awaiter(void 0, void 0, void 0, function* () {
            yield client_model_1.default.updateOne({ 'jobPostDetails._id': body.jobID }, {
                $inc: {
                    'jobPostDetails.$.noOfCompleted': 1
                }
            }).then(() => {
                res.json({
                    success: true,
                });
            });
        }))
            .catch(err => { res.json((0, mongoError_service_1.default)(err)); });
    }
});
exports.UpdateProposalStatusHandler = UpdateProposalStatusHandler;
const GetAllDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.params.id === 'all') {
        let proposals = yield proposal_model_1.default.find({ clientID: req.headers.clientid, jobID: req.headers.jobid, proposalStatus: 'REVIEW' });
        let hiredProposals = yield proposal_model_1.default.find({ clientID: req.headers.clientid, jobID: req.headers.jobid }).where({ $or: [{ proposalStatus: 'HIRED' }, { workStatus: "COMPLETED" }] });
        let reviews = yield review_model_1.default.find({});
        let pp = [];
        let hp = [];
        for (let prop of proposals) {
            let rating = 0, length = 0;
            reviews.map(rev => {
                if (rev.influencerID === prop.influencerID) {
                    rating = rev.reviewRating;
                    length++;
                }
            });
            if (length !== 0)
                rating = rating / length;
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
        for (let prop of hiredProposals) {
            let rating = 0, length = 0, isPaid;
            reviews.map(rev => {
                if (rev.influencerID === prop.influencerID) {
                    rating = rev.reviewRating;
                    length++;
                }
            });
            if (length !== 0)
                rating = rating / length;
            prop = prop.toJSON();
            if (prop.proposalStatus === 'PAID')
                isPaid = true;
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
    }
    else if (req.params.id === 'hired') {
        let hiredProposals = yield proposal_model_1.default.find({ clientID: req.headers.clientid, jobID: req.headers.jobid, proposalStatus: 'HIRED', workStatus: "INPROGRESS" }, { jobTitle: 0 });
        let completedProposals = yield proposal_model_1.default.find({ clientID: req.headers.clientid, jobID: req.headers.jobid }).where({ $or: [{ workStatus: "COMPLETED" }, { proposalStatus: "PAID" }] });
        let reviews = yield review_model_1.default.find({});
        let hp = [];
        let cp = [];
        for (let prop of hiredProposals) {
            let rating = 0, length = 0;
            reviews.map(rev => {
                if (rev.influencerID === prop.influencerID) {
                    rating = rev.reviewRating;
                    length++;
                }
            });
            if (length !== 0)
                rating = rating / length;
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
        for (let prop of completedProposals) {
            let rating = 0, length = 0, isPaid = false;
            reviews.map(rev => {
                if (rev.influencerID === prop.influencerID) {
                    rating = rev.reviewRating;
                    length++;
                }
            });
            if (length !== 0)
                rating = rating / length;
            prop = prop.toJSON();
            if (prop.proposalStatus === 'PAID')
                isPaid = true;
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
    }
    else if (req.params.id === "detail") {
        let prop = yield proposal_model_1.default.findOne({ _id: req.headers._id });
        prop = prop.toJSON();
        let reviews = yield review_model_1.default.find({});
        let rating = 0, length = 0, isPaid = false;
        reviews.map(rev => {
            if (rev.influencerID === prop.influencerID) {
                rating = rev.reviewRating;
                length++;
            }
        });
        if (length !== 0)
            rating = rating / length;
        if (prop.proposalStatus === 'PAID')
            isPaid = true;
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
        };
        res.json({
            success: true,
            proposal: pp
        });
    }
});
exports.GetAllDetails = GetAllDetails;
