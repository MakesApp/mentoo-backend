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
        origin: "*",
        methods: ["GET", "POST"],
        // credentials: true
    },
});
io.on('connection', (socket) => {
    // Join a room
    socket.on('join room', async (room) => {
        socket.join(room);
        // Fetch and send all messages from this room
        const conversation = await conversation_model_1.default.findOne({ room }).populate('transcript.sender');
        if (conversation) {
            // Emit chat history to the user
            socket.emit('chat history', conversation.transcript);
        }
    });
    // Handle a new chat message
    socket.on('chat message', async (msg, room) => {
        let conversation = await conversation_model_1.default.findOne({ room });
        if (!conversation) {
            // If the conversation does not exist, create it
            conversation = new conversation_model_1.default({ room, transcript: [], placeUserId: msg.user, userId: msg.user });
        }
        const newMessage = new conversation_model_1.Message({
            sender: new mongoose_1.default.Types.ObjectId(msg.user),
            message: msg.message,
            isOpened: false,
        });
        // Add the new message to the transcript
        conversation.transcript.push(newMessage);
        await conversation.save();
        // Emit the new message to all users in the room
        io.to(room).emit('chat message', msg);
    });
    socket.on('disconnect', () => {
    });
});
socketServer.listen(8080, () => {
    console.log("socket server run on port 8080");
});
