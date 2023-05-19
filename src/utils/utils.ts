import { ObjectId } from "mongodb";
import Conversation from "../components/conversations/conversation.model";

export const addMsgToConversation = async (
  userId: ObjectId,
  placeId: ObjectId,
  msg: string,
  isOpened: boolean
) => {
  const message = { sender: userId, message: msg, isOpened };
  try {
    await Conversation.findOneAndUpdate(
      { userId, placeId },
      { $push: { transcript: message } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  } catch (err) {
    console.log(err);
  }
};
