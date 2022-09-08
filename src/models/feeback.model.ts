import mongoose from "mongoose";

const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
    userType: { type: String, required: true },
    firebaseID: { type: String, required: true },
    name: { type: String, required: true },
    profileImg: { type: String, required: true },
    feedbackTitle: { type: String, required: true },
    feedbackDescription: { type: String, required: true },
    feedbackDate: { type: Number, default: (new Date()).getTime() }
})

const FeedbackSchema = mongoose.models.feedback || mongoose.model('feedback', feedbackSchema);

export = FeedbackSchema;