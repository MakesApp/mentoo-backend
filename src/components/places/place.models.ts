import mongoose, { Document, Schema } from "mongoose";

export interface IPlace extends Document {
  placeName: string;
  availableDays: string[];
  address: string;
  description: string;
  audience: string;
  placeImage?: string;
  user: Schema.Types.ObjectId;
  _doc?:any;
}

const placeSchema: Schema<IPlace> = new mongoose.Schema<IPlace>({
  placeName: {
    type: String,
    required: true, 
    trim: true,
  },
  availableDays: {
    type: [String],
    default: [] 
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
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' 
  },
  
});

const Place = mongoose.model<IPlace>("Place", placeSchema);

export default Place;
