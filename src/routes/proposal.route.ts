import { Router } from "express";
import { CreateProposalHandler, GetAllDetails, UpdateProposalStatusHandler } from "../controllers/proposal.controller";
import { validateRequest } from "../middlewares/validateType.middleware";
import { proposalDetails } from "../schemas/proposal.schema";

const router = Router();

router.get('/:id', GetAllDetails);
router.post('/', validateRequest(proposalDetails), CreateProposalHandler);
router.put('/:id', UpdateProposalStatusHandler);

export = router;