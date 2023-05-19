"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const conversation_controllers_js_1 = require("./conversation.controllers.js");
const conversationRouter = (0, express_1.Router)();
conversationRouter.get("/conversation", conversation_controllers_js_1.getConversation);
conversationRouter.get("/conversations", conversation_controllers_js_1.getAllConversations);
conversationRouter.get("/conversations/active/:userId/:placeId", conversation_controllers_js_1.toggleUser);
exports.default = conversationRouter;
