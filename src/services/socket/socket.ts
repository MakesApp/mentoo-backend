import express from "express";
import server from "http";
import { Server } from "socket.io";
import Conversation, { Message } from "../../components/conversations/conversation.model";

import mongoose, { Schema } from 'mongoose'
const app = express();
const socketServer = server.createServer(app);

const io = new Server(socketServer, {
  cors: {
    origin: [`${process.env.CLIENT_URL}`],
    methods: ["GET", "POST"],
    // credentials: true
  },
});

io.on('connection', (socket) => {

 
  socket.on('join room', async(room, userId,partnerId) => {
    socket.join(room);
let conversation = await Conversation.findOne({ room });
  if (!conversation) {
    // If the conversation does not exist, create it
    conversation = new Conversation({ room, transcript: [], users: [userId, partnerId] }); // Add partnerId to the users array
    await conversation.save();
  } else {
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
    let conversation = await Conversation.findOne({ room });
    if (conversation) { // Add this check to ensure conversation is not null
      const msgObj={
        _id: new mongoose.Types.ObjectId(),
        sender: new mongoose.Types.ObjectId(msg.sender),
        message: msg.message,
        createdAt: new Date(), // Add the createdAt timestamp

      }
      const newMessage = new Message(msgObj);
      console.log(newMessage);
      

      // Add the new message to the transcript
      conversation.transcript.push(newMessage);
      await conversation.save();

      // Emit the new message to all users in the room
      io.to(room).emit('chat message', msgObj);
    }
  });
  
  socket.on('messages seen', async (messageIds, room, userId) => {
  try {
    const conversation = await Conversation.findOne({ room });
    if (conversation) {
      messageIds.forEach(messageId => {
        const message = conversation.transcript.find((msg) => msg._id.toString() === messageId);
        if (message && !message.seenBy) {
          // Set the seenBy field to the user's ID
          message.seenBy = new mongoose.Types.ObjectId(userId);
        }
      });
      await conversation.save();
      // Emit the updated message to all users in the room
      io.to(room).emit('messages seen', messageIds);
    }
  } catch (error) {
    console.error(error);
  }
});


    socket.on('disconnect', () => {
    });
});

socketServer.listen(process.env.SOCKET_PORT||8080, () => {
  console.log("socket server run on port ",process.env.SOCKET_PORT||8080);
});

