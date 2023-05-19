"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNotifications = void 0;
const notification_model_1 = __importDefault(require("./notification.model"));
const getNotifications = async (req, res) => {
    const { receiver } = req.query;
    try {
        const result = await notification_model_1.default.find({ receiver });
        if (result.length > 0) {
            return res.send(result);
        }
        res.status(404).send({ message: "Notification not found" });
    }
    catch (err) {
        res.status(500).send({ message: err });
    }
};
exports.getNotifications = getNotifications;
