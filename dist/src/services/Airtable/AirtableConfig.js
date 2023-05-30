"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.base = void 0;
const airtable_1 = __importDefault(require("airtable"));
const apiKey = process.env.AIRTABLE_API_KEY;
const baseId = process.env.AIRTABLE_BASE_ID;
if (!apiKey || !baseId) {
    throw new Error("Environment variables AIRTABLE_API_KEY or AIRTABLE_BASE_ID are not defined");
}
exports.base = new airtable_1.default({ apiKey }).base(baseId);
