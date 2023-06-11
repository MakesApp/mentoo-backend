import express from "express";
import server from "http";
import { Server } from "socket.io";
import Conversation, { Message } from "../../components/conversations/conversation.model";

import mongoose, { Schema } from 'mongoose'
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
  socket.on('join room', async(room) => {
    socket.join(room);

    // Fetch and send all messages from this room
    const conversation = await Conversation.findOne({ room });
    if (conversation) {
      // Emit chat history to the user
      socket.emit('chat history', conversation.transcript);
    }
  });

  // Handle a new chat message
  socket.on('chat message', async (msg, room) => {
    let conversation = await Conversation.findOne({ room });
    if (!conversation) {
      // If the conversation does not exist, create it
      conversation = new Conversation({ room, transcript: [], partnerId: msg.partnerId, userId: msg.sender });
    }
    console.log(msg);
    

    const newMessage = new Message({
      sender: new mongoose.Types.ObjectId(msg.sender),
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

