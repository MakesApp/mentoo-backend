import mongoose, { Schema, model, Types, Document } from "mongoose";

interface IMessage extends Document {
  sender: mongoose.Types.ObjectId;
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
  partnerId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  transcript: IMessage[];
  isActive: boolean;
  room:string;
}

const conversationSchema: Schema<IConversation> = new Schema<IConversation>({
  room:{type:String,required:true},
  partnerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  transcript: [messageSchema],
  isActive: { type: Boolean, default: false },
});

const Conversation = model<IConversation>("Conversation", conversationSchema);
export const Message = model<IMessage>("Message", messageSchema);

export default Conversation;
