"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateFeedbackHandler = void 0;
const mongoError_service_1 = __importDefault(require("../services/mongoError.service"));
const feeback_model_1 = __importDefault(require("../models/feeback.model"));
const CreateFeedbackHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let body = req.body;
    let newFeedback = new feeback_model_1.default(body);
    yield feeback_model_1.default.create(newFeedback)
        .then(() => {
        res.json({
            success: true,
        });
    })
        .catch((err) => { res.json((0, mongoError_service_1.default)(err)); });
});
exports.CreateFeedbackHandler = CreateFeedbackHandler;
