import mongoose, { Document, Schema } from "mongoose";

export interface IPlace extends Document {
  placeName: string;
  availableDays: string[];
  address: string;
  description: string;
  audience: string;
  placeImage?: string;
  agentId:Schema.Types.ObjectId;
}

const placeSchema: Schema<IPlace> = new mongoose.Schema<IPlace>({
   placeName: {
    type: String,
    required: true, // placeName is required
    trim: true, // remove leading and trailing spaces
  },
  availableDays: {
    type: [String], // an array of strings
    default: [] // default is an empty array
  },
  address:{
    type: String,
    default: "",
    trim: true,
  },
  description:{
    type: String,
    default: "",
    trim: true,
  },
  audience:{
    type: String,
    default: "",
    trim: true,
  },
  placeImage:{
    type: String,
  },
  agentId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // reference to the User schema
  }
});

const Place = mongoose.model<IPlace>("Place", placeSchema);

export default Place;
