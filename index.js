import express from "express";
import userRouter from "./components/users/user.routes.js";
import conversationRouter from "./components/conversations/conversation.routes.js";
import notificationRouter from "./components/notifications/notifications.routes.js";
import "./services/DB/mongoose.js";
import "./services/socket/socket.js";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 9000;

const app = express();
app.use(express.json());

app.use("/api", userRouter);
app.use("/api", conversationRouter);
app.use("/api", notificationRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
