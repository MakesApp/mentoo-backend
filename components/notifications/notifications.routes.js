import { Router } from "express";
import Notification from "./notification.model.js";

const notificationRouter = Router();

notificationRouter.get("/notifications", async (req, res) => {
  const { reciever } = req.query;

  try {
    const result = await Notification.find({ reciever });
    if (result) return res.send(result);

    res.status(404).send();
  } catch (err) {
    res.status(500).send({ message: err });
  }
});

export default notificationRouter;
