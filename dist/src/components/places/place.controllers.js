"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlaceById = exports.getPlaces = void 0;
const place_models_1 = __importDefault(require("./place.models"));
const getPlaces = async (req, res) => {
    try {
        const places = await place_models_1.default.find({}).populate('agentId').exec();
        res.status(201).json({ places });
    }
    catch (error) {
        console.error("Fetching places Error :", error);
        res.status(500).json({ error: "כשל במשיכת הנתונים" });
    }
};
exports.getPlaces = getPlaces;
const getPlaceById = async (req, res) => {
    try {
        const { placeId } = req.params;
        const place = await place_models_1.default.findById(placeId).populate('agentId').exec();
        res.status(201).json({ place });
    }
    catch (error) {
        console.error("Fetching place by id Error :", error);
        res.status(500).json({ error: "כשל במשיכת הנתונים" });
    }
};
exports.getPlaceById = getPlaceById;
