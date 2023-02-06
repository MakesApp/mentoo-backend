import express from "express";
import userRouter from "./components/users/user.routes.js";
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 9000;
app.use("/api", userRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
