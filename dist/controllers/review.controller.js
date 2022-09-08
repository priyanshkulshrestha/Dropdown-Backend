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
exports.CreateReviewHandler = void 0;
const mongoError_service_1 = __importDefault(require("../services/mongoError.service"));
const review_model_1 = __importDefault(require("../models/review.model"));
const influencer_model_1 = __importDefault(require("../models/influencer.model"));
const client_model_1 = __importDefault(require("../models/client.model"));
const CreateReviewHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let body = req.body;
    let influencer = yield influencer_model_1.default.findOne({ firebaseID: req.body.influencerID }, { creationDate: 0 });
    let client = yield client_model_1.default.findOne({ firebaseID: req.body.clientID }, { creationDate: 0 });
    body.username = influencer.username;
    body.influencerName = influencer.name;
    body.clientName = client.name;
    body.companyName = client.companyName;
    body.brandLogo = client.brandLogo;
    let newReview = new review_model_1.default(body);
    yield review_model_1.default.create(newReview)
        .then(() => {
        newReview = newReview.toJSON();
        delete newReview.__v;
        res.json({
            success: true,
            review: newReview
        });
    })
        .catch(err => { res.json((0, mongoError_service_1.default)(err)); });
});
exports.CreateReviewHandler = CreateReviewHandler;
