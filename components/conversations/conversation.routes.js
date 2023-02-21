import { Router } from "express";
import { getConversations, toggleUser } from "./conversation.controllers.js";

const conversationRouter = Router();

conversationRouter.get("/conversations", getConversations);
conversationRouter.get("/conversations/active/:userId/:placeId", toggleUser);

export default conversationRouter;
