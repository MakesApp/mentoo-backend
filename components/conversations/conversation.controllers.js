import Conversation from "./conversation.model.js";

export const getConversation = async (req, res) => {
  const { placeId, userId } = req.query;

  try {
    const result = await Conversation.findOne({ placeId, userId });
    if (result) return res.send(result);

    res.status(404).send({ message: "conversation not found" });
  } catch (err) {
    res.status(500).send({ message: err });
  }
};

export const toggleUser = async (req, res) => {
  const { userId, placeId } = req.params;
  try {
    const result = await Conversation.findOneAndUpdate({ userId, placeId }, [
      { $set: { isActive: { $eq: [false, "$isActive"] } } },
    ]);
    res.send(result);
  } catch (message) {
    res.status(500).send({ message });
  }
};

export const getAllConversations = async (req, res) => {
  const { placeId, userId } = req.query;
  const query = placeId ? "placeId" : "userId";

  try {
    const result = await Conversation.find(
      { [query]: placeId || userId },
      { _id: 1, [query]: 1, lastMsg: { $last: "$transcript" } }
    );
    if (result) return res.send(result);

    res.status(404).send({ message: "conversation not found" });
  } catch (err) {
    res.status(500).send({ message: err });
  }
};
