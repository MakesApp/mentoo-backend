import express from "express";
import userRouter from "./src/components/users/user.routes";
import conversationRouter from "./src/components/conversations/conversation.routes";
import notificationRouter from "./src/components/notifications/notifications.routes";
import "./src/services/DB/mongoose";
import "./src/services/socket/socket";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 9000;

const app = express();
app.use(express.json());

app.use("/api", userRouter);
app.use("/api", conversationRouter);
app.use("/api", notificationRouter);

app.get("/", (req: express.Request, res: express.Response) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
