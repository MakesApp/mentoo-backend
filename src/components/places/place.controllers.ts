import { Request, Response } from "express";
import Place from "./place.models";


export const getPlaces = async (req: Request, res: Response) => {
  try{
      
    const places=await Place.find({}).populate('agentId').exec();
    res.status(201).json({ places});
  } catch (error) {
    console.error("Fetching places Error :", error);
    res.status(500).json({ error: "כשל במשיכת הנתונים" });
  }
};

export const getPlaceById=async (req: Request, res: Response) => {
  try{
    const {placeId}=req.params;
    const place=await Place.findById(placeId).populate('agentId').exec();
    res.status(201).json({ place});
  }
  catch(error){
    console.error("Fetching place by id Error :", error);
    res.status(500).json({ error: "כשל במשיכת הנתונים" });

  }
};