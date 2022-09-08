import mongoose from "mongoose";

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    influencerID: { type: String, required: true },
    clientID: { type: String, required: true },
    username: { type: String, required: true },
    influencerName: { type: String, required: true },
    clientName: { type: String, required: true },
    companyName: { type: String, required: true },
    brandLogo: { type: String, required: true },
    reviewDescription: { type: String, required: true },
    reviewRating: { type: String, required: true },
    reviewDate: { type: Number, default: (new Date()).getTime() }
})

const ReviewSchema = mongoose.models.review || mongoose.model('review', reviewSchema);

export = ReviewSchema;