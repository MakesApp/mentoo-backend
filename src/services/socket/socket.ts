import express from "express";
import server from "http";
import { Server } from "socket.io";
import Notification from "../../components/notifications/notification.model.js";
import { addMsgToConversation } from "../../utils/utils.js";

const app = express();
const socketServer = server.createServer(app);

const io = new Server(socketServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    // credentials: true
  },
});

io.on('connection', (socket) => {

    // Join a room
     socket.on('join room', (room) => {
        const userIds = room.split('_');
        if (userIds[0] === userIds[1]) {
            console.log('A user attempted to chat with themselves.');
        } else {
            socket.join(room);
        }
    });


    // Leave a room
    socket.on('leave room', (room) => {
        socket.leave(room);
    });

    // Forward a chat message to all users in the room
    socket.on('chat message', (msg, room) => {
        socket.to(room).emit('chat message', msg);
    });

    socket.on('disconnect', () => {
    });
});
socketServer.listen(8080, () => {
  console.log("socket server run on port 8080");
});

