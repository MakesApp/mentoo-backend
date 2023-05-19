"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllConversations = exports.toggleUser = exports.getConversation = void 0;
const conversation_model_1 = __importDefault(require("./conversation.model"));
const getConversation = async (req, res) => {
    const { placeId, userId } = req.query;
    try {
        const result = await conversation_model_1.default.findOne({ placeId, userId });
        if (result)
            return res.send(result);
        res.status(404).send({ message: "Conversation not found" });
    }
    catch (err) {
        res.status(500).send({ message: err });
    }
};
exports.getConversation = getConversation;
const toggleUser = async (req, res) => {
    const { userId, placeId } = req.params;
    try {
        const result = await conversation_model_1.default.findOneAndUpdate({ userId, placeId }, { $set: { isActive: { $eq: [false, "$isActive"] } } });
        res.send(result);
    }
    catch (error) {
        res.status(500).send({ message: error });
    }
};
exports.toggleUser = toggleUser;
const getAllConversations = async (req, res) => {
    const { placeId, userId } = req.query;
    const query = placeId ? "placeId" : "userId";
    try {
        const result = await conversation_model_1.default.find({ [query]: placeId || userId }, { _id: 1, [query]: 1, lastMsg: { $last: "$transcript" } });
        if (result.length > 0) {
            return res.send(result);
        }
        res.status(404).send({ message: "Conversation not found" });
    }
    catch (err) {
        res.status(500).send({ message: err });
    }
};
exports.getAllConversations = getAllConversations;
