import mongoose, { Document, Schema } from "mongoose";

export interface IPlace extends Document {
  placeName: string;
  availableDays: string[];
  address: string;
  description: string;
  audience: string;
  placeImage?: string;
  agentId: Schema.Types.ObjectId;
  myVolunteers: Schema.Types.ObjectId[];
  candidateVolunteers: Schema.Types.ObjectId[];
  oldVolunteers: Schema.Types.ObjectId[];
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
  agentId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' 
  },
  myVolunteers:{
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: [] 
  },
  candidateVolunteers:{
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: [] 
  },
  oldVolunteers:{
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: [] 
  },
});

const Place = mongoose.model<IPlace>("Place", placeSchema);

export default Place;
