import mongoose, { Document, Schema } from "mongoose";
import validator from "validator";

export interface IUser extends Document {
  email: string;
  password: string;
  role:string;
  avatar:string;
}

const userSchema: Schema<IUser> = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    trim: true,
    validate: {
      validator: (value: string) => !value.toLowerCase().includes("password"),
      message: 'Password cannot contain "password"',
    },
  },
   role: {
    type: String,
    enum: ['volunteer', 'place'], // Only 'volunteer' or 'place' allowed
  },
  avatar: {
    type: String,
    default: '' // Default value if none is provided
  }
});

const User = mongoose.model<IUser>("Users", userSchema);

export default User;
