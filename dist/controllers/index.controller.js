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
const axios_1 = __importDefault(require("axios"));
const client_model_1 = __importDefault(require("../models/client.model"));
const influencer_model_1 = __importDefault(require("../models/influencer.model"));
require('dotenv').config();
const GetIndustriesController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = [
        {
            industry: "Health",
            subIndustry: [
                "Sexual",
                "Mental",
                "Emotional",
                "Nutrition",
                "Psychology",
                "Psychiatry",
                "Dermatology",
                "Dentistry"
            ]
        },
        {
            industry: "Gym and Fitness",
            subIndustry: [
                "Yoga",
                "Aerobics",
                "Fitness Training",
                "Athletics",
                "Adventure Sports"
            ]
        },
        {
            industry: "Sports",
            subIndustry: []
        },
        {
            industry: "Beauty",
            subIndustry: [
                "Skincare",
                "Facecare",
                "Haircare",
                "Bath and Body",
                "Eyecare",
                "Lipcare",
                "Nailcare",
                "Sanitizing Kits",
                "Accessories"
            ]
        },
        {
            industry: "Fashion",
            subIndustry: [
                "Footwear",
                "Bags",
                "Apparel",
                "Modelling",
                "Jewellery",
                "Eyecare",
                "Accessories"
            ]
        },
        {
            industry: "Lifestyle",
            subIndustry: [
                "Home Decor",
                "Spirituality",
                "Wellness",
                "Aesthetic",
                "Kitchen",
                "Plants",
                "Menstrual Care"
            ]
        },
        {
            industry: "Toys & Babycare",
            subIndustry: [
                "Maternity Care",
                "Clothing",
                "Parenting",
                "School Supplies"
            ]
        },
        {
            industry: "Business",
            subIndustry: [
                "Automotive",
                "Startup",
                "Creative Writer"
            ]
        },
        {
            industry: "Photography",
            subIndustry: []
        },
        {
            industry: "Art and Design",
            subIndustry: [
                "Handicrafts",
                "Visual Art",
                "Digital Art",
                "Illustrations"
            ]
        },
        {
            industry: "Entertainment",
            subIndustry: [
                "Music",
                "Film and TV",
                "Dance",
                "Media",
                "News",
                "Comedy",
                "Producer",
                "Books",
                "Blogger"
            ]
        },
        {
            industry: "Technology",
            subIndustry: [
                "NFT",
                "Web 3.0",
                "Data",
                "Gadgets",
                "Software"
            ]
        },
        {
            industry: "Travel and tourism",
            subIndustry: []
        },
        {
            industry: "Food and Beverage",
            subIndustry: [
                "Organic",
                "Vegan",
                "Plant Based"
            ]
        },
        {
            industry: "Gaming",
            subIndustry: []
        },
        {
            industry: "Animals and Wildlife",
            subIndustry: []
        },
        {
            industry: "Social Cause",
            subIndustry: []
        },
        {
            industry: "Education",
            subIndustry: [
                "Legal",
                "Academic",
                "Teaching",
                "Finance",
            ]
        },
        {
            industry: "Career",
            subIndustry: [
                "Academic",
                "Personal Growth"
            ]
        }
    ];
    res.json(payload);
    console.log(payload);
});
const GetTasksController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const payload = [{
            platform: "instagram",
            tasks: [
                "Reel",
                "Post",
                "Story",
                "Live"
            ]
        }, {
            platform: "linkedin",
            tasks: [
                "Post",
                "Poll",
                "Live",
                "Article",
                "Event",
                "Like/Commment",
                "Share"
            ]
        }, {
            platform: "snapchat",
            tasks: [
                "Spotlight",
                "Story"
            ]
        }, {
            platform: "twitter",
            tasks: [
                "Tweet",
                "Retweet",
                "Hashtag",
                "Share"
            ]
        }, {
            platform: "discord",
            tasks: [
                "Message"
            ]
        }, {
            platform: "medium",
            tasks: [
                "Blog Post",
                "Share Blog"
            ]
        }, {
            platform: "youtube",
            tasks: [
                "Video",
                "Shorts",
                "Poll",
                "Post",
                "Live"
            ]
        }, {
            platform: "pinterest",
            tasks: [
                "Idea Pin",
                "Pin",
                "Board"
            ]
        }];
    let platformName = (_b = ((_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.platform)) === null || _b === void 0 ? void 0 : _b.toString();
    const task = payload.find((load) => load.platform === platformName.toLocaleLowerCase());
    res.json(task === null || task === void 0 ? void 0 : task.tasks);
});
const GetLocationController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let key = process.env.LOCATION_API_KEY;
    if (req.params.id === 'country') {
        yield axios_1.default.get("https://api.countrystatecity.in/v1/countries", {
            headers: {
                'X-CSCAPI-KEY': key
            },
        })
            .then(result => {
            let location = result.data;
            res.json({
                success: true,
                countries: location
            });
        })
            .catch(error => {
            console.log(error);
            res.json({
                success: false,
            });
        });
    }
    else if (req.params.id === 'state') {
        let countryID = req.query.countryID;
        yield axios_1.default.get(`https://api.countrystatecity.in/v1/countries/${countryID}/states`, {
            headers: {
                'X-CSCAPI-KEY': key
            },
        })
            .then(result => {
            let location = result.data;
            let stateNames = [];
            for (let state of location) {
                stateNames.push(state.name);
            }
            res.json({
                success: true,
                states: location,
                stateNames
            });
        })
            .catch(error => {
            console.log(error);
            res.json({
                success: false,
            });
        });
    }
    else if (req.params.id === 'city') {
        let countryID = req.query.countryID;
        let stateID = req.query.stateID;
        yield axios_1.default.get(`https://api.countrystatecity.in/v1/countries/${countryID}/states/${stateID}/cities`, {
            headers: {
                'X-CSCAPI-KEY': key
            },
        })
            .then(result => {
            let location = result.data;
            let cityNames = [];
            for (let state of location) {
                cityNames.push(state.name);
            }
            res.json({
                success: true,
                cities: location,
                cityNames
            });
        })
            .catch(error => {
            console.log(error);
            res.json({
                success: false,
            });
        });
    }
});
const GetUserType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let firebaseID = req.headers.firebaseid;
    let clientDetails = yield client_model_1.default.findOne({ firebaseID });
    if (clientDetails !== null) {
        let isComplete = true;
        if (clientDetails.name === null || clientDetails.email === null || clientDetails.companyName === null ||
            clientDetails.websiteLink === null || clientDetails.location === null) {
            isComplete = false;
        }
        res.json({
            success: true,
            userType: 'client',
            isComplete,
            userDetails: {
                firebaseID: clientDetails.firebaseID,
                name: clientDetails.companyName,
                email: clientDetails.email,
                location: clientDetails.location,
                profile: clientDetails.brandLogo,
            }
        });
    }
    else {
        let influencerDetails = yield influencer_model_1.default.findOne({ firebaseID });
        if (influencerDetails !== null) {
            let isComplete = true;
            if (influencerDetails.name === null || influencerDetails.profileLink === null ||
                influencerDetails.location === null || influencerDetails.username === null || influencerDetails.gender === null ||
                influencerDetails.age === null || influencerDetails.industry === null || influencerDetails.audienceSize === null) {
                isComplete = false;
            }
            res.json({
                success: true,
                userType: 'influencer',
                isComplete,
                userDetails: {
                    firebaseID: influencerDetails.firebaseID,
                    name: influencerDetails.name,
                    email: influencerDetails.email,
                    location: influencerDetails.location,
                    profile: influencerDetails.influencerLogo,
                    // location: ,
                    // city: ,
                    // state: ,
                    // gender: ,
                    // age: ,
                    // payment: ,
                    // platform: ,
                    // platformLogo: ,
                    // bio: ,
                    // industry: , 
                    // userName: ,
                }
            });
        }
        else {
            res.json({
                success: true,
                userType: 'Not Registered',
                isComplete: null,
                userDetails: null
            });
        }
    }
});
const verifyUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.type === 'client') {
        yield client_model_1.default.updateOne({ _id: req.id }, {
            $set: {
                isVerified: true,
            }
        })
            .then(() => {
            res.send('User Verfied!');
        })
            .catch(() => {
            res.send('Verification Error!');
        });
    }
    else {
        yield influencer_model_1.default.updateOne({ _id: req.id }, {
            $set: {
                isVerified: true,
            }
        })
            .then(() => {
            res.send('User Verfied!');
        })
            .catch(() => {
            res.send('Verification Error!');
        });
    }
});
module.exports = { GetIndustriesController, GetTasksController, GetLocationController, GetUserType, verifyUser };
