import { Router } from "express";
import authMiddleware from "../../auth/authMiddleware";
import { getPlaceById, getPlaces, updateVolunteerList } from "./place.controllers";

const router = Router();



router.get("/place/getPlaces", authMiddleware,getPlaces);
router.get("/place/:placeId", authMiddleware,getPlaceById);
router.patch("/place/:placeId", authMiddleware,updateVolunteerList);
export default router;