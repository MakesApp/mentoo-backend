import { Router } from "express";
import {
  getConversation,
  toggleUser,
  getAllConversations,
} from "./conversation.controllers.js";

const conversationRouter = Router();

conversationRouter.get("/conversation", getConversation);
conversationRouter.get("/conversations", getAllConversations);
conversationRouter.get("/conversations/active/:userId/:placeId", toggleUser);

export default conversationRouter;
