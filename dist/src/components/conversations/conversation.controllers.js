"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChatPartners = exports.toggleUser = exports.getConversation = void 0;
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
const getChatPartners = async (req, res) => {
    try {
        // Assuming req.user._id contains the authenticated user's ID
        const userId = req.user.userId;
        // Find all conversations where the authenticated user is a participant
        const conversations = await conversation_model_1.default.find({ users: userId }).populate('users', '-password');
        let users = [];
        conversations.forEach(conversation => {
            // Iterate over each conversation's users array
            conversation.users.forEach((user) => {
                // If the user is not the authenticated user and not already included, add them to the users array
                if (user._id.toString() !== userId.toString() && !users.some((u) => u._id.toString() === user._id.toString())) {
                    users.push(user);
                }
            });
        });
        res.json(users); // Returns a list of users (with their data) the authenticated user had a conversation with
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};
exports.getChatPartners = getChatPartners;
