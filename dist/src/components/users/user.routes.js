"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controllers_1 = require("./user.controllers");
const router = (0, express_1.Router)();
router.post("/user/register", user_controllers_1.register);
router.post("/user/login", user_controllers_1.login);
exports.default = router;
