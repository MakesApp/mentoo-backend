import mongoose, { Schema, model, Types, Document } from "mongoose";

interface IMessage extends Document {
  _id: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  message: string;
  seenBy: mongoose.Types.ObjectId | null;
}

const messageSchema: Schema<IMessage> = new Schema<IMessage>(
  {
    _id: { type: Schema.Types.ObjectId },
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    message: {
      type: String,
    },
    seenBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);


interface IConversation extends Document {
  users: Schema.Types.ObjectId[];
  transcript: IMessage[];
  isActive: boolean;
  room:string;
}

const conversationSchema: Schema<IConversation> = new Schema<IConversation>({
  room:{type:String,required:true,unique:true},
  users: { type: [Schema.Types.ObjectId], ref: "User", required: true },
  transcript: [messageSchema],
  isActive: { type: Boolean, default: false },
});

const Conversation = model<IConversation>("Conversation", conversationSchema);
export const Message = model<IMessage>("Message", messageSchema);

export default Conversation;
