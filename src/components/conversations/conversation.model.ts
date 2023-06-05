import { Schema, model, Types, Document } from "mongoose";

interface IMessage extends Document {
  sender: Schema.Types.ObjectId;
  message: string;
  isOpened: boolean;
}

const messageSchema: Schema<IMessage> = new Schema<IMessage>(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    message: {
      type: String,
      required: true,
    },
    isOpened: { type: Boolean, required: true },
  },
  { timestamps: true }
);

interface IConversation extends Document {
  placeId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  transcript: IMessage[];
  isActive: boolean;
}

const conversationSchema: Schema<IConversation> = new Schema<IConversation>({
  placeId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  transcript: [messageSchema],
  isActive: { type: Boolean, default: false },
});

const Conversation = model<IConversation>("Conversation", conversationSchema);

export default Conversation;
