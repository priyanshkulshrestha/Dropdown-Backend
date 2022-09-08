import Home from "../controllers/index.controller";
import { Router } from "express";
import { authenticateSignupToken } from "../middlewares/verifyToken.middleware";

const router = Router();
router.get('/industry', Home.GetIndustriesController);
router.get('/task', Home.GetTasksController);
router.get('/user', Home.GetUserType);
router.get('/:id', Home.GetLocationController);
router.get('/verify/:token', authenticateSignupToken, Home.verifyUser);

export = router;