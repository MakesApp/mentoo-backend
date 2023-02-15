import express from "express";
import server from "http";
import { Server } from "socket.io";

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
  console.log(`we are live and connected ${socket.id}`);

  socket.on("join", (room) => socket.join(room));

  socket.on("send_message", ({ userId, placeId, msg }) => {
    io.sockets.in(`${userId}-${placeId}`).emit("new_message", msg);

    const usersInRoom = io.sockets.adapter.rooms.get(
      `${userId}-${placeId}`
    ).size;

    if (usersInRoom === 1) {
      // add message to conversation DB,isOpened=false
      // add message to notifications DB
    } else if (usersInRoom === 2) {
      // add message to conversation DB,isOpened=true
    }
  });
});

socketServer.listen(8080, (err) => {
  if (!err) console.log("socket server run on port 8080");
});
