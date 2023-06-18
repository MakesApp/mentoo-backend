import express from "express";
import userRouter from "./src/components/users/user.routes";
import conversationRouter from "./src/components/conversations/conversation.routes";
import notificationRouter from "./src/components/notifications/notifications.routes";
import placeRouter from './src/components/places/place.routes'
import "./src/services/DB/mongoose";
import "./src/services/socket/socket";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
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

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
