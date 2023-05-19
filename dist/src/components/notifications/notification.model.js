"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const notificationSchema = new mongoose_1.Schema({
    sender: { type: mongoose_1.Schema.Types.ObjectId, ref: "Users", required: true },
    receiver: { type: mongoose_1.Schema.Types.ObjectId, ref: "Users", required: true },
});
const Notification = (0, mongoose_1.model)("Notification", notificationSchema);
exports.default = Notification;
