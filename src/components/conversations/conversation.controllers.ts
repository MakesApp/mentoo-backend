import { Request, Response } from "express";
import Conversation from "./conversation.model";

export const getConversation = async (req: Request, res: Response) => {
  const { placeId, userId } = req.query;

  try {
    const result = await Conversation.findOne({ placeId, userId });
    if (result) return res.send(result);

    res.status(404).send({ message: "Conversation not found" });
  } catch (err) {
    res.status(500).send({ message: err });
  }
};

export const toggleUser = async (req: Request, res: Response) => {
  const { userId, placeId } = req.params;
  try {
    const result = await Conversation.findOneAndUpdate(
      { userId, placeId },
      { $set: { isActive: { $eq: [false, "$isActive"] } } }
    );
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

export const getAllConversations = async (req: Request, res: Response) => {
  const { placeId, userId } = req.query;
  const query = placeId ? "placeId" : "userId";

  try {
    const result = await Conversation.find(
      { [query]: placeId || userId },
      { _id: 1, [query]: 1, lastMsg: { $last: "$transcript" } }
    );
    if (result.length > 0) {
      return res.send(result);
    }

    res.status(404).send({ message: "Conversation not found" });
  } catch (err) {
    res.status(500).send({ message: err });
  }
};
