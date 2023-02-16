import Conversation from "../components/conversations/conversation.model.js";

export const addMsgToConversation = async (userId, placeId, msg, isOpened) => {
  const result = await Conversation.findOne({ userId, placeId });
  if (result) {
    result.transcript.push({ sender: userId, message: msg, isOpened });
    await result.save();
  } else {
    await new Conversation({
      placeId,
      userId,
      transcript: [{ sender: userId, message: msg, isOpened }],
    }).save();
  }
};
