"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateVolunteerList = exports.getPlaceById = exports.getPlaces = void 0;
const place_models_1 = __importDefault(require("./place.models"));
const getPlaces = async (req, res) => {
    try {
        const places = await place_models_1.default.find({}).exec();
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
        const place = await place_models_1.default.findById(placeId)
            .exec();
        res.status(201).json({ place });
    }
    catch (error) {
        console.error("Fetching place by id Error :", error);
        res.status(500).json({ error: "כשל במשיכת הנתונים" });
    }
};
exports.getPlaceById = getPlaceById;
const updateVolunteerList = async (req, res) => {
    const { placeId } = req.params;
    const { query } = req.body;
    try {
        const updatedDoc = await place_models_1.default.findByIdAndUpdate(placeId, query, { new: true });
        res.status(201).json({ place: updatedDoc });
    }
    catch (error) {
        console.error("Updating place Error :", error);
        res.status(500).json({ error: "כשל בעדכון הנתונים" });
    }
};
exports.updateVolunteerList = updateVolunteerList;
