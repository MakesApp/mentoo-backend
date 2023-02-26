import Conversation from "../components/conversations/conversation.model.js";

export const addMsgToConversation = async (userId, placeId, msg, isOpened) => {
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
