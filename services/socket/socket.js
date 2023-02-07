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
});
socketServer.listen(8080, (err) => {
  if (!err) console.log("socket server run on port 8080");
});
