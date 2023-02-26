import { Schema, model, SchemaTypes } from "mongoose";
import { Users } from "../users/user.models.js";

const Notification = model(
  "notification",
  new Schema({
    sender: { type: SchemaTypes.ObjectId, ref: Users, required: true },
    reciever: { type: SchemaTypes.ObjectId, ref: Users, required: true },
  })
);

export default Notification;
