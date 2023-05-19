import mongoose, { Document, Schema } from "mongoose";
import validator from "validator";

export interface IUser extends Document {
  email: string;
  password: string;
}

const userSchema: Schema<IUser> = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    validate: {
      validator: (value: string) => validator.isEmail(value),
      message: "Email is invalid",
    },
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
});

const User = mongoose.model<IUser>("Users", userSchema);

export default User;
