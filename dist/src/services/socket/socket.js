"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const conversation_model_1 = __importStar(require("../../components/conversations/conversation.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const app = (0, express_1.default)();
const socketServer = http_1.default.createServer(app);
const io = new socket_io_1.Server(socketServer, {
    cors: {
        origin: [`${process.env.CLIENT_URL}`, "*"],
        methods: ["GET", "POST"],
        // credentials: true
    },
});
io.on('connection', (socket) => {
    socket.on('join room', async (room, userId, partnerId) => {
        socket.join(room);
        let conversation = await conversation_model_1.default.findOne({ room });
        if (!conversation) {
            // If the conversation does not exist, create it
            conversation = new conversation_model_1.default({ room, transcript: [], users: [userId, partnerId] }); // Add partnerId to the users array
            await conversation.save();
        }
        else {
            // If the conversation already exists and the user is not in it, add the user
            if (!conversation.users.includes(userId)) {
                conversation.users.push(userId);
                await conversation.save();
            }
        }
        // Fetch and send all messages from this room
        // You don't need to fetch conversation again as it's already fetched above
        if (conversation) {
            // Emit chat history to the user
            socket.emit('chat history', conversation.transcript);
        }
    });
    // Handle a new chat message
    socket.on('chat message', async (msg, room) => {
        let conversation = await conversation_model_1.default.findOne({ room });
        if (conversation) { // Add this check to ensure conversation is not null
            const newMessage = new conversation_model_1.Message({
                _id: new mongoose_1.default.Types.ObjectId(),
                sender: new mongoose_1.default.Types.ObjectId(msg.sender),
                message: msg.message,
            });
            // Add the new message to the transcript
            conversation.transcript.push(newMessage);
            await conversation.save();
            // Emit the new message to all users in the room
            io.to(room).emit('chat message', msg);
        }
    });
    socket.on('messages seen', async (messageIds, room, userId) => {
        try {
            const conversation = await conversation_model_1.default.findOne({ room });
            if (conversation) {
                messageIds.forEach(messageId => {
                    const message = conversation.transcript.find((msg) => msg._id.toString() === messageId);
                    if (message && !message.seenBy) {
                        // Set the seenBy field to the user's ID
                        message.seenBy = new mongoose_1.default.Types.ObjectId(userId);
                    }
                });
                await conversation.save();
                // Emit the updated message to all users in the room
                io.to(room).emit('messages seen', messageIds);
            }
        }
        catch (error) {
            console.error(error);
        }
    });
    socket.on('disconnect', () => {
    });
});
socketServer.listen(process.env.SOCKET_PORT || 8080, () => {
    console.log("socket server run on port ", process.env.SOCKET_PORT || 8080);
});
