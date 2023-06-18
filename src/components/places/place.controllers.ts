import { Request, Response } from "express";
import Place from "./place.models";
import {fetchUsersWithUnreadMessages} from '../../utils/utils'

export const getPlaces = async (req: Request, res: Response) => {
  try{
      
    const places=await Place.find({}).exec();
    res.status(201).json({ places});
  } catch (error) {
    console.error("Fetching places Error :", error);
    res.status(500).json({ error: "כשל במשיכת הנתונים" });
  }
};

export const getPlaceById=async (req: Request, res: Response) => {
  try{
    const {placeId}=req.params;
    let place=await Place.findById(placeId).populate('myVolunteers').populate('candidateVolunteers').populate('oldVolunteers')
      .exec();
      if(!place)
      throw new Error('')

    const myVolunteersWithUnreadMessages = await fetchUsersWithUnreadMessages(place.myVolunteers);
    const oldVolunteersWithUnreadMessages = await fetchUsersWithUnreadMessages(place.oldVolunteers);
    const candidateVolunteersWithUnreadMessages = await fetchUsersWithUnreadMessages(place.candidateVolunteers);


    res.status(201).json({place:{ ...place._doc,
    myVolunteers:[...myVolunteersWithUnreadMessages],
    oldVolunteers:[...oldVolunteersWithUnreadMessages],
    candidateVolunteers:[...candidateVolunteersWithUnreadMessages]
    }});
  }
  catch(error){
    console.error("Fetching place by id Error :", error);
    res.status(500).json({ error: "כשל במשיכת הנתונים" });

  }
};

export const updateVolunteerList=async (req: Request, res: Response) => {
  const {placeId}=req.params;
  const {query}=req.body;
  try{

  const updatedDoc=  await Place.findByIdAndUpdate(placeId,query,{new:true})

      res.status(201).json({ place:updatedDoc});

  }

  catch(error){
    console.error("Updating place Error :", error);
    res.status(500).json({ error: "כשל בעדכון הנתונים" });

  }
}