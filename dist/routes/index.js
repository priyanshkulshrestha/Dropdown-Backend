"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const index_route_1 = __importDefault(require("./index.route"));
const client_route_1 = __importDefault(require("./client.route"));
const influencer_route_1 = __importDefault(require("./influencer.route"));
const proposal_route_1 = __importDefault(require("./proposal.route"));
const review_route_1 = __importDefault(require("./review.route"));
const feedback_route_1 = __importDefault(require("./feedback.route"));
module.exports = { IndexRoutes: index_route_1.default, ClientRoutes: client_route_1.default, ProposalRoutes: proposal_route_1.default, ReviewRoutes: review_route_1.default, InfluencerRoutes: influencer_route_1.default, FeedbackRoutes: feedback_route_1.default };
