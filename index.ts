import express from "express";
import userRouter from "./src/components/users/user.routes";
import conversationRouter from "./src/components/conversations/conversation.routes";
import notificationRouter from "./src/components/notifications/notifications.routes";
import placeRouter from './src/components/places/place.routes'
import "./src/services/DB/mongoose";
// import "./src/services/socket/socket";
import {Server} from 'socket.io'
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import Conversation, { Message } from "./src/components/conversations/conversation.model";
import mongoose from "mongoose";
dotenv.config();


const PORT = process.env.EXPRESS_PORT || 9000;

const app = express();

app.use(express.json());
app.use(cookieParser());


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  res.header('Access-Control-Expose-Headers', 'Content-Length');
  res.header(
    'Access-Control-Allow-Headers',
    'Accept, Authorization, Content-Type, X-Requested-With, Range'
  );
  next();
});


app.use("/api", userRouter);
app.use("/api", placeRouter);
app.use("/api", conversationRouter);
app.use("/api", notificationRouter);

app.use('/api',(_,res)=>{
  res.send('heelo')
})

const server = app.listen(PORT, () =>
  console.log(`Server started on ${PORT}`)
);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
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


