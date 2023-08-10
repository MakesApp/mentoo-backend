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
import User from './src/components/users/user.models'
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

  socket.on('join room', async(room, userId, partnerId) => {
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

    io.to(room).emit('all messages', conversation.transcript);
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

      // Check if the sender is a volunteer and this is their first message
      if (msg.role === 'volunteer') {
        // Fetch the place and add the sender to the candidateVolunteers array
        
        let user = await User.findOne({ _id:conversation.users.find(id => id.toString() !== msg.sender) });
        if (user) {
          // Ensure the user is not already in candidateVolunteers, myVolunteers or oldVolunteers
          if (!user.candidateVolunteers.includes(msg.sender) && !user.myVolunteers.includes(msg.sender) && !user.oldVolunteers.includes(msg.sender)) {
            user.candidateVolunteers.push(msg.sender);
            await user.save();
          }
        }
      }

      await conversation.save();
      io.to(room).emit('chat message', msgObj);
    }
  });

  socket.on('mark as seen', async (userId, roomId) => {
    let conversation = await Conversation.findOne({ room: roomId });
    if(conversation) {
      // Find unseen messages
      const unseenMessages = conversation.transcript.filter(msg => !msg.seenBy && msg.sender.toString() !== userId);
      // Update seen status
      
      unseenMessages.forEach(msg => {
        msg.seenBy = new mongoose.Types.ObjectId(userId);
      });
      await conversation.save();
    }
  });
  
  socket.on('disconnect', () => {
    // Handle socket disconnection logic
  });
});
