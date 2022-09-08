import { Request, Response } from "express";
import MongoErrorHandler from "../services/mongoError.service";
import { ReviewDetails } from "../schemas/review.schema";
import ReviewSchema from "../models/review.model";
import InfluencerSchema from "../models/influencer.model";
import ClientSchema from "../models/client.model";

export const CreateReviewHandler = async (req: Request<{}, {}, Partial<ReviewDetails>>, res: Response) => { 
    let body = req.body;
    let influencer = await InfluencerSchema.findOne({ firebaseID: req.body.influencerID }, { creationDate: 0})
    let client = await ClientSchema.findOne({ firebaseID: req.body.clientID }, {creationDate: 0})
    body.username = influencer.username;
    body.influencerName = influencer.name;
    body.clientName = client.name;
    body.companyName = client.companyName;
    body.brandLogo = client.brandLogo;
    let newReview = new ReviewSchema(body);
    await ReviewSchema.create(newReview)
    .then(() => {
        newReview = newReview.toJSON();  delete newReview.__v;
        res.json({
            success: true,
            review: newReview
        });
    })
    .catch(err => { res.json(MongoErrorHandler(err)); });
}