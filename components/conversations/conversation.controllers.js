import Conversation from "./conversation.model.js";

export const getConversation = async (req, res) => {
  const { placeId, userId } = req.query;

  try {
    const result = await Conversation.findOne({ placeId, userId });
    if (result) return res.send(result);

    res.status(404).send();
  } catch (err) {
    res.status(500).send({ message: err });
  }
};

export const toggleUser = async (req, res) => {
  const { userId, placeId } = req.params;
  try {
    await Conversation.findOneAndUpdate({ userId, placeId }, [
      { $set: { isActive: { $eq: [false, "$isActive"] } } },
    ]);
    res.send();
  } catch (message) {
    res.status(500).send({ message });
  }
};

export const getAllConversations = async (req, res) => {
  const { placeId, userId } = req.query;
  let result;
  try {
    if (placeId)
      result = await Conversation.find(
        { placeId },
        { _id: 1, userId: 1, lastMsg: { $last: "$transcript" } }
      );
    else if (userId)
      result = await Conversation.find(
        { userId },
        { _id: 1, placeId: 1, lastMsg: { $last: "$transcript" } }
      );

    if (result) return res.send(result);

    res.status(404).send();
  } catch (err) {
    res.status(500).send({ message: err });
  }
};
