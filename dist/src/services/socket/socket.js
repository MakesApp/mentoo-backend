"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const utils_js_1 = require("../../utils/utils.js");
const app = (0, express_1.default)();
const socketServer = http_1.default.createServer(app);
const io = new socket_io_1.Server(socketServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        // credentials: true
    },
});
io.on("connection", (socket) => {
    socket.on("join", (room) => socket.join(room));
    socket.on("send_message", ({ userId, placeId, msg }) => {
        const roomKey = `${userId}-${placeId}`;
        const room = io.sockets.adapter.rooms.get(roomKey);
        const usersInRoom = room ? room.size : 0;
        if (!usersInRoom)
            return;
        if (usersInRoom === 1) {
            (0, utils_js_1.addMsgToConversation)(userId, placeId, msg, false);
            // new Notification({ sender: userId, reciever: placeId }).save();
        }
        else if (usersInRoom === 2) {
            (0, utils_js_1.addMsgToConversation)(userId, placeId, msg, true);
        }
    });
});
socketServer.listen(8080, () => {
    console.log("socket server run on port 8080");
});
