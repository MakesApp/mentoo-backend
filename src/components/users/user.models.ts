import mongoose, { Document, Schema } from "mongoose";
import validator from "validator";

export interface IUser extends Document {
  email: string;
  password: string;
  role: string;
  avatar?: string; // avatar is optional
  fullName: string;
  placeId?: Schema.Types.ObjectId; // placeId is optional
}

const userSchema: Schema<IUser> = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Invalid email'],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    trim: true,
    validate: {
      validator: (value: string) => !value.toLowerCase().includes("password"),
      message: 'Password cannot contain "password"',
    },
  },
  role: {
    type: String,
    enum: ['volunteer', 'place'],
    default: 'volunteer', // Default value if none is provided
  },
  avatar: {
    type: String,
    // No default value, it will be undefined if not provided
  },
  fullName:{
    type: String,
    default: "",
    trim: true,
  },
  placeId:{
    type: Schema.Types.ObjectId,
    ref: 'Place',

    // No default value, it will be undefined if not provided
  }
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
