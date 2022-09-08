import { Request, Response } from "express";
import MongoErrorHandler from "../services/mongoError.service";
import FeebackSchema from "../models/feeback.model";

export const CreateFeedbackHandler = async (req: Request, res: Response) => { 
    let body = req.body;
    let newFeedback = new FeebackSchema(body);
    await FeebackSchema.create(newFeedback)
    .then(() => {
        res.json({
            success: true,
        });
    })
    .catch((err: any) => { res.json(MongoErrorHandler(err)); });
}