"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtConfig_1 = require("../config/jwtConfig");
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        res.status(401).json({ message: "No token, authorization denied." });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, jwtConfig_1.jwtSecret);
        // Add user from payload
        req.user = decoded;
        next();
    }
    catch (e) {
        res.status(400).json({ message: "Token is not valid" });
    }
};
exports.default = authMiddleware;
