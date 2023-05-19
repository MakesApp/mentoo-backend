"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMsgToConversation = void 0;
const conversation_model_1 = __importDefault(require("../components/conversations/conversation.model"));
const addMsgToConversation = async (userId, placeId, msg, isOpened) => {
    const message = { sender: userId, message: msg, isOpened };
    try {
        await conversation_model_1.default.findOneAndUpdate({ userId, placeId }, { $push: { transcript: message } }, { upsert: true, new: true, setDefaultsOnInsert: true });
    }
    catch (err) {
        console.log(err);
    }
};
exports.addMsgToConversation = addMsgToConversation;
