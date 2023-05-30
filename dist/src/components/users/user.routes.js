"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleWare_1 = __importDefault(require("../../auth/authMiddleWare"));
const user_controllers_1 = require("./user.controllers");
const router = (0, express_1.Router)();
router.post("/user/register", user_controllers_1.register);
router.post("/user/login", user_controllers_1.login);
router.get("/user/auth", authMiddleWare_1.default, user_controllers_1.getUser);
exports.default = router;
