"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = __importDefault(require("../../auth/authMiddleware"));
const place_controllers_1 = require("./place.controllers");
const router = (0, express_1.Router)();
router.get("/place/getPlaces", authMiddleware_1.default, place_controllers_1.getPlaces);
router.get("/place/:placeId", authMiddleware_1.default, place_controllers_1.getPlaceById);
router.patch("/place/:placeId", authMiddleware_1.default, place_controllers_1.updateVolunteerList);
exports.default = router;
