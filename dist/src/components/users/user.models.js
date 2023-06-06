"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const userSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate: [validator_1.default.isEmail, 'Invalid email'],
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        trim: true,
        validate: {
            validator: (value) => !value.toLowerCase().includes("password"),
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
    fullName: {
        type: String,
        default: "",
        trim: true,
    },
    placeId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Place',
        // No default value, it will be undefined if not provided
    }
});
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
