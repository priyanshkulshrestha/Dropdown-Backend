import { Router } from "express";
import { CreateInfluencerHandler, DeleteInfluencerHandler, GetAllDetails, GetAllInfluencerDetails, GetJobsHandler, IsCompleteInfluencerHandler, UpdateInfluencerHandler, UpdateInfluencerSavedJobsHandler } from "../controllers/influencer.controller";
import { validateRequest } from "../middlewares/validateType.middleware";
import { influencerDetails } from "../schemas/influencer.schema";
import { upload } from "../services/imageUpload.service";

const router = Router();

router.get('/', GetAllInfluencerDetails);
router.get('/iscomplete', IsCompleteInfluencerHandler);
router.get('/:id', GetAllDetails);
router.post('/', validateRequest(influencerDetails), CreateInfluencerHandler);
router.put('/', UpdateInfluencerHandler);
router.get('/job/:id', GetJobsHandler);
router.put('/job/:id', UpdateInfluencerSavedJobsHandler);
router.delete('/', DeleteInfluencerHandler);

export = router;