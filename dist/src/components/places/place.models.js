"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const placeSchema = new mongoose_1.default.Schema({
    placeName: {
        type: String,
        required: true,
        trim: true, // remove leading and trailing spaces
    },
    availableDays: {
        type: [String],
        default: [] // default is an empty array
    },
    address: {
        type: String,
        default: "",
        trim: true,
    },
    description: {
        type: String,
        default: "",
        trim: true,
    },
    audience: {
        type: String,
        default: "",
        trim: true,
    },
    placeImage: {
        type: String,
    },
    agentId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User' // reference to the User schema
    }
});
const Place = mongoose_1.default.model("Place", placeSchema);
exports.default = Place;
