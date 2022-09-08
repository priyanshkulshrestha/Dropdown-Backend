"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const index_controller_1 = __importDefault(require("../controllers/index.controller"));
const express_1 = require("express");
const verifyToken_middleware_1 = require("../middlewares/verifyToken.middleware");
const router = (0, express_1.Router)();
router.get('/industry', index_controller_1.default.GetIndustriesController);
router.get('/task', index_controller_1.default.GetTasksController);
router.get('/user', index_controller_1.default.GetUserType);
router.get('/:id', index_controller_1.default.GetLocationController);
router.get('/verify/:token', verifyToken_middleware_1.authenticateSignupToken, index_controller_1.default.verifyUser);
module.exports = router;
