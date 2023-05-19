"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const userSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
        validate: {
            validator: (value) => validator_1.default.isEmail(value),
            message: "Email is invalid",
        },
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        trim: true,
        validate: {
            validator: (value) => !value.toLowerCase().includes("password"),
            message: 'Password cannot contain "password"',
        },
    },
});
const User = mongoose_1.default.model("Users", userSchema);
exports.default = User;
