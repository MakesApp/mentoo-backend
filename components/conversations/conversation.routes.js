import { Router } from "express";
import { getConversations } from "./conversation.controllers.js";

const conversationRouter = Router();

conversationRouter.get("/conversations", getConversations);

export default conversationRouter;
