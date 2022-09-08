"use strict";
const express_1 = require("express");
const feedback_controller_1 = require("../controllers/feedback.controller");
const router = (0, express_1.Router)();
router.post('/', feedback_controller_1.CreateFeedbackHandler);
module.exports = router;
