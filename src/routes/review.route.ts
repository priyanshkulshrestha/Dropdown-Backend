import { Router } from "express";
import { CreateReviewHandler } from "../controllers/review.controller";
import { validateRequest } from "../middlewares/validateType.middleware";
import { reviewDetails } from "../schemas/review.schema";

const router = Router();

router.post('/', validateRequest(reviewDetails), CreateReviewHandler);

export = router;