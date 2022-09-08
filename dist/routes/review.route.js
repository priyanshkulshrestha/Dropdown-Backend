"use strict";
const express_1 = require("express");
const review_controller_1 = require("../controllers/review.controller");
const validateType_middleware_1 = require("../middlewares/validateType.middleware");
const review_schema_1 = require("../schemas/review.schema");
const router = (0, express_1.Router)();
router.post('/', (0, validateType_middleware_1.validateRequest)(review_schema_1.reviewDetails), review_controller_1.CreateReviewHandler);
module.exports = router;
