import Notification from "./notification.model.js";

export const getNotifications = async (req, res) => {
  const { reciever } = req.query;

  try {
    const result = await Notification.find({ reciever });
    if (result) return res.send(result);

    res.status(404).send({ message: "conversation not found" });
  } catch (err) {
    res.status(500).send({ message: err });
  }
};
