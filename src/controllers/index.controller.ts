import { Request, Response } from "express";
import axios from 'axios'
import ClientSchema from "../models/client.model";
import InfluencerSchema from "../models/influencer.model";
require('dotenv').config()

const GetIndustriesController = async (req: Request, res: Response) => { 
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
}

const GetTasksController = async (req: Request, res: Response) => {
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
    }]
    let platformName: any = (req?.query?.platform)?.toString()
    const task = payload.find((load: any) => load.platform === platformName.toLocaleLowerCase() )
    res.json(task?.tasks); 
}

const GetLocationController = async (req: Request, res: Response) => {
    let key: any = process.env.LOCATION_API_KEY
    if(req.params.id === 'country') {
        await axios.get("https://api.countrystatecity.in/v1/countries", {
            headers: {
                'X-CSCAPI-KEY': key
            },
        })
        .then(result => { 
            let location = result.data
            res.json({
                success: true,
                countries: location
            })
        })
        .catch(error => { 
            console.log(error)
            res.json({
                success: false,
            })
        });
    } else if(req.params.id === 'state') {
        let countryID = req.query.countryID;
        await axios.get(`https://api.countrystatecity.in/v1/countries/${countryID}/states`, {
            headers: {
                'X-CSCAPI-KEY': key
            },
        })
        .then(result => { 
            let location = result.data
            let stateNames: any = [];
            for(let state of location) {
                stateNames.push(state.name)
            }
            res.json({
                success: true,
                states: location,
                stateNames
            })
        })
        .catch(error => { 
            console.log(error)
            res.json({
                success: false,
            })
        });
    } else if(req.params.id === 'city') {
        let countryID = req.query.countryID;
        let stateID = req.query.stateID;
        await axios.get(`https://api.countrystatecity.in/v1/countries/${countryID}/states/${stateID}/cities`, {
            headers: {
                'X-CSCAPI-KEY': key
            },
        })
        .then(result => { 
            let location = result.data
            let cityNames: any = [];
            for(let state of location) {
                cityNames.push(state.name)
            }
            res.json({
                success: true,
                cities: location,
                cityNames
            })
        })
        .catch(error => { 
            console.log(error)
            res.json({
                success: false,
            })
        });
    }
}

const GetUserType = async (req: Request, res: Response) => {
    let firebaseID = req.headers.firebaseid;
    let clientDetails = await ClientSchema.findOne({ firebaseID });
    if(clientDetails !== null) {
        let isComplete = true;
        if (clientDetails.name === null || clientDetails.email === null || clientDetails.companyName === null ||
            clientDetails.websiteLink === null || clientDetails.location === null) {
            isComplete = false
        }
        res.json({
            success: true,
            userType: 'client',
            isComplete,
            userDetails: {      // change here user details to client or influencer details and other null
                firebaseID: clientDetails.firebaseID,
                name: clientDetails.companyName,
                email: clientDetails.email,
                location: clientDetails.location,
                profile: clientDetails.brandLogo,
            }
        })
    } 
    else {
        let influencerDetails = await InfluencerSchema.findOne({ firebaseID });
        if(influencerDetails !== null) {
            let isComplete = true;
            if (influencerDetails.name === null || influencerDetails.profileLink === null ||
                influencerDetails.location === null || influencerDetails.username === null || influencerDetails.gender === null ||
                influencerDetails.age === null || influencerDetails.industry === null || influencerDetails.audienceSize === null) {
                isComplete = false
            }
            res.json({
                success: true,
                userType: 'influencer',
                isComplete,
                userDetails: { // change here user details to client or influencer details and other null
                    firebaseID: influencerDetails.firebaseID,
                    name: influencerDetails.name,
                    email: influencerDetails.email,
                    location: influencerDetails.location,
                    profile: influencerDetails.influencerLogo,
                    // Work for these things more
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
            })
        } else {
            res.json({
                success: true,
                userType: 'Not Registered',
                isComplete: null,
                userDetails: null
            })
        }
    }
}

const verifyUser = async (req: any, res: Response) => {
    if(req.type === 'client') {
        await ClientSchema.updateOne({ _id: req.id }, {
            $set: {
                isVerified: true,
            }
        })
        .then(() => {
            res.send('User Verfied!');
        })
        .catch(() => {
            res.send('Verification Error!');
        })
    } else {
        await InfluencerSchema.updateOne({ _id: req.id }, {
            $set: {
                isVerified: true,
            }
        })
        .then(() => {
            res.send('User Verfied!');
        })
        .catch(() => {
            res.send('Verification Error!');
        })
    }
}

export = { GetIndustriesController, GetTasksController, GetLocationController, GetUserType, verifyUser };