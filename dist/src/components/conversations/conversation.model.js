"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const mongoose_1 = require("mongoose");
const messageSchema = new mongoose_1.Schema({
    sender: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    message: {
        type: String,
        required: true,
    },
    isOpened: { type: Boolean, required: true },
}, { timestamps: true });
const conversationSchema = new mongoose_1.Schema({
    room: { type: String, required: true },
    partnerId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    transcript: [messageSchema],
    isActive: { type: Boolean, default: false },
});
const Conversation = (0, mongoose_1.model)("Conversation", conversationSchema);
exports.Message = (0, mongoose_1.model)("Message", messageSchema);
exports.default = Conversation;
