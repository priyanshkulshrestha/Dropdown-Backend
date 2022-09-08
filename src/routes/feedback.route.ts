import { Router } from "express";
import { CreateFeedbackHandler } from "../controllers/feedback.controller";

const router = Router();

router.post('/', CreateFeedbackHandler);

export = router;