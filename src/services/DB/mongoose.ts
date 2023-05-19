import * as dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

const URI: string = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.ekr9x9i.mongodb.net/?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
const options: mongoose.ConnectOptions = {
};


mongoose.connect(
  URI,
 options,
  () => {
    console.log(`mongodb is connected`);
  }
);
