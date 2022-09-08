import mongoose from "mongoose";

const Schema = mongoose.Schema;

const influencerSchema = new Schema({
    email: { type: String, unique: true },
    firebaseID: { type: String, unique: true, required: true },
    name: { type: String, default: null },
    platform: { type: String, default: null }, 
    platformLogo: { type: String, default: null }, 
    influencerLogo: { type: String, default: 'https://dropdown-files.s3.us-west-2.amazonaws.com/logos/default.png' }, 
    influencerLogoKey: { type: String, default: null }, 
    profileLink: { type: String, default: null },
    location: { type: String, default: null },  
    state: { type: String, default: null }, 
    city: { type: String, default: null }, 
    username: { type: String, default: null },
    gender: { type: String, default: null },
    age: { type: String, default: null },
    bio: { type: String, default: null },
    upiID: { type: String, default: null },
    industry: { type: String, default: null },
    subIndustry: { type: [String], default: [] },
    audienceSize: { type: String, default: null },
    savedJobsID: { type: [String], default: [] },
    creationDate: { type: Number, default: (new Date()).getTime() },
    isVerified: { type: Boolean, default: false },
    earningDetails: {
        type: [{
            country: { type: String, required: true },
            companyLogo: { type: String, required: true },
            companyName: { type: String, required: true },
            earningValue: { type: String, required: true },
            dateOfPayment: { type: Number, required: true, default: (new Date()).getTime()  },
        }],
        default: []
    }
});

const InfluencerSchema = mongoose.models.influencer || mongoose.model('influencer', influencerSchema);

export = InfluencerSchema;