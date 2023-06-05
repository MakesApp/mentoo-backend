import { Router } from "express";
import authMiddleware from "../../auth/authMiddleWare";
import { getPlaceById, getPlaces } from "./place.controllers";

const router = Router();



router.get("/place/getPlaces", authMiddleware,getPlaces);
router.get("/place/:placeId", authMiddleware,getPlaceById);
export default router;