import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import Conversation, { Message } from "../../components/conversations/conversation.model";
import mongoose from 'mongoose';

const app = express();

const httpServer = createServer(app);
console.log(process.env.CLIENT_URL);

const io = new Server(httpServer, {
  cors: {
    origin: [`${process.env.CLIENT_URL}`],
    methods: ["GET", "POST"],
  },
});


io.on('connection', (socket) => {
  socket.on('join room', async(room, userId,partnerId) => {
    socket.join(room);
    let conversation = await Conversation.findOne({ room });
    if (!conversation) {
      conversation = new Conversation({ room, transcript: [], users: [userId, partnerId] });
      await conversation.save();
    } else {
      if (!conversation.users.includes(userId)) {
        conversation.users.push(userId);
        await conversation.save();
      }
    }
    if (conversation) {
      socket.emit('chat history', conversation.transcript);
    }
  });

  socket.on('chat message', async (msg, room) => {
    let conversation = await Conversation.findOne({ room });
    if (conversation) {
      const msgObj = {
        _id: new mongoose.Types.ObjectId(),
        sender: new mongoose.Types.ObjectId(msg.sender),
        message: msg.message,
        createdAt: new Date(),
      };
      const newMessage = new Message(msgObj);
      conversation.transcript.push(newMessage);
      await conversation.save();
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
            message.seenBy = new mongoose.Types.ObjectId(userId);
          }
        });
        await conversation.save();
        io.to(room).emit('messages seen', messageIds);
      }
    } catch (error) {
      console.error(error);
    }
  });

  socket.on('disconnect', () => {
    // Handle socket disconnection logic
  });
});

export default httpServer;
