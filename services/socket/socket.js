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
    // credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.on("join", (room) => socket.join(room));

  socket.on("send_message", ({ userId, placeId, msg }) => {
    io.sockets.in(`${userId}-${placeId}`).emit("new_message", msg);

    const usersInRoom = io.sockets.adapter.rooms.get(
      `${userId}-${placeId}`
    ).size;

    if (usersInRoom === 1) {
      addMsgToConversation(userId, placeId, msg, false);
      new Notification({ sender: userId, reciever: placeId }).save();
    } else if (usersInRoom === 2) {
      addMsgToConversation(userId, placeId, msg, true);
    }
  });
});

socketServer.listen(8080, (err) => {
  if (!err) console.log("socket server run on port 8080");
});
