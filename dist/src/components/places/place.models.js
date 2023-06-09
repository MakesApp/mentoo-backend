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
        trim: true,
    },
    availableDays: {
        type: [String],
        default: []
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
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User'
    },
    myVolunteers: {
        type: [mongoose_1.default.Schema.Types.ObjectId],
        ref: 'User',
        default: []
    },
    candidateVolunteers: {
        type: [mongoose_1.default.Schema.Types.ObjectId],
        ref: 'User',
        default: []
    },
    oldVolunteers: {
        type: [mongoose_1.default.Schema.Types.ObjectId],
        ref: 'User',
        default: []
    },
});
const Place = mongoose_1.default.model("Place", placeSchema);
exports.default = Place;
