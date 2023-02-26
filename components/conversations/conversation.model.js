import { Schema, model, SchemaTypes } from "mongoose";
import { Users } from "../users/user.models.js";

const Message = new Schema(
  {
    sender: { type: SchemaTypes.ObjectId, ref: Users, required: true },
    message: {
      type: String,
      required: true,
    },
    isOpened: { type: Boolean, required: true },
  },
  { timestamps: true }
);

const Conversation = model(
  "conversation",
  new Schema({
    placeId: { type: SchemaTypes.ObjectId, ref: Users, required: true },
    userId: { type: SchemaTypes.ObjectId, ref: Users, required: true },
    transcript: [Message],
    isActive: { type: Boolean, default: false },
  })
);

export default Conversation;
