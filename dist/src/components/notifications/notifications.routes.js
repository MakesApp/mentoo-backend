"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notification_controllers_js_1 = require("./notification.controllers.js");
const notificationRouter = (0, express_1.Router)();
notificationRouter.get("/notifications", notification_controllers_js_1.getNotifications);
exports.default = notificationRouter;
