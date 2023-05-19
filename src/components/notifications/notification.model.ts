import { Schema, model, SchemaTypes, Document } from "mongoose";

interface INotification  {
  sender: Schema.Types.ObjectId;
  receiver:  Schema.Types.ObjectId;
}

const notificationSchema: Schema<INotification> = new Schema<INotification>({
  sender: { type:  Schema.Types.ObjectId, ref: "Users", required: true },
  receiver: { type:  Schema.Types.ObjectId, ref: "Users", required: true },
});

const Notification = model<INotification>("Notification", notificationSchema);

export default Notification;
