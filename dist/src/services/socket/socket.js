"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
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
    console.log('a user connected');
    // Join a room
    socket.on('join room', (room) => {
        const userIds = room.split('_');
        if (userIds[0] === userIds[1]) {
            console.log('A user attempted to chat with themselves.');
        }
        else {
            socket.join(room);
        }
    });
    // Leave a room
    socket.on('leave room', (room) => {
        socket.leave(room);
    });
    // Forward a chat message to all users in the room
    socket.on('chat message', (msg, room) => {
        console.log('message: ', msg);
        console.log('room: ', room);
        socket.to(room).emit('chat message', msg);
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});
socketServer.listen(8080, () => {
    console.log("socket server run on port 8080");
});
