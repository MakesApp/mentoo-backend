"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = __importDefault(require("../../auth/authMiddleware"));
const conversation_controllers_js_1 = require("./conversation.controllers.js");
const conversationRouter = (0, express_1.Router)();
conversationRouter.get("/conversation", conversation_controllers_js_1.getConversation);
conversationRouter.get("/conversation/getChatPartners", authMiddleware_1.default, conversation_controllers_js_1.getChatPartners);
conversationRouter.get("/conversations/active/:userId/:placeId", conversation_controllers_js_1.toggleUser);
exports.default = conversationRouter;
