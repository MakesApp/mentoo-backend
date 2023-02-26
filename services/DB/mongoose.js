import * as dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

const URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.ekr9x9i.mongodb.net/?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);

mongoose.connect(
  URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) console.log(err);
    else console.log(`mongodb is connected`);
  }
);
