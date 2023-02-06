import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()
const MONGO_URL = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@moviecluster.gpx1i3n.mongodb.net/?retryWrites=true&w=majority`;

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("connected to mongoDB");
  })
  .catch((e) => {
    console.log("mongoDB error", e);
  });
