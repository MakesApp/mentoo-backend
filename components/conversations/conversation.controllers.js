import Conversation from "./conversation.model.js";

export const getConversations = async (req, res) => {
  const { placeId, userId } = req.query;

  try {
    const result = await Conversation.find({ placeId, userId });
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
