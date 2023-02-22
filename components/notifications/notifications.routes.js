import { Router } from "express";
import { getNotifications } from "./notification.controllers.js";

const notificationRouter = Router();

notificationRouter.get("/notifications", getNotifications);

export default notificationRouter;
