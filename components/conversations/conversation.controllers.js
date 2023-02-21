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
