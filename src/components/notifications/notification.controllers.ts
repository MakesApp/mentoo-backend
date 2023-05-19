import { Request, Response } from "express";
import Notification from "./notification.model";

export const getNotifications = async (req: Request, res: Response) => {
  const { receiver } = req.query;

  try {
    const result = await Notification.find({ receiver });
    if (result.length > 0) {
      return res.send(result);
    }

    res.status(404).send({ message: "Notification not found" });
  } catch (err) {
    res.status(500).send({ message: err });
  }
};
