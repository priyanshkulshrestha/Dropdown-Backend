import { Router } from "express";
import { CloseJobHandler, CreateClientHandler, DeleteClientHandler, GetAllClientDetails, GetAllDetails, PostJobHandler, UpdateClientHandler, UpdateJobHandler } from "../controllers/client.controller";
import { validateRequest } from "../middlewares/validateType.middleware";
import { clientDetails } from "../schemas/client.schema";
import { jobPostDetailsInput } from "../schemas/jobPost.schema";
import { upload } from "../services/imageUpload.service";

const router = Router();

router.get('/', GetAllClientDetails);
router.get('/:id', GetAllDetails);
router.post('/', validateRequest(clientDetails), CreateClientHandler);
router.put('/', UpdateClientHandler);
router.delete('/', DeleteClientHandler);
router.post('/job', validateRequest(jobPostDetailsInput), PostJobHandler);
router.put('/job', UpdateJobHandler);
router.put('/job/close', CloseJobHandler);
export = router;