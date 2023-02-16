import { Router } from "express";
import Conversation from "./conversation.model.js";

const conversationRouter = Router();

conversationRouter.get("/conversations", async (req, res) => {
  const { placeId, userId } = req.query;

  try {
    const result = await Conversation.find({ placeId, userId });
    if (result) return res.send(result);

    res.status(404).send();
  } catch (err) {
    res.status(500).send({ message: err });
  }
});

export default conversationRouter;
