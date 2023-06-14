import { Router } from "express";
import authMiddleware from "../../auth/authMiddleware";
import {
  getConversation,
  toggleUser,
  getChatPartners,
} from "./conversation.controllers.js";

const conversationRouter = Router();

conversationRouter.get("/conversation", getConversation);
conversationRouter.get("/conversation/getChatPartners", authMiddleware,getChatPartners);
conversationRouter.get("/conversations/active/:userId/:placeId", toggleUser);

export default conversationRouter;
