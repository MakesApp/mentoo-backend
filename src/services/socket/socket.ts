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

io.on("connection", (socket) => {
  socket.on("join", (room) => socket.join(room));

  socket.on("send_message", ({ userId, placeId, msg }) => {
  const roomKey = `${userId}-${placeId}`;
  const room = io.sockets.adapter.rooms.get(roomKey);
  const usersInRoom = room ? room.size : 0;


    if (!usersInRoom) return;

    if (usersInRoom === 1) {
      addMsgToConversation(userId, placeId, msg, false);
      // new Notification({ sender: userId, reciever: placeId }).save();
    } else if (usersInRoom === 2) {
      addMsgToConversation(userId, placeId, msg, true);
    }
  });
});
socketServer.listen(8080, () => {
  console.log("socket server run on port 8080");
});

