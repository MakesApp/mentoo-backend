import { Request, Response } from "express";
import mongoose from "mongoose";
import { IUser } from "../users/user.models";
import Conversation from "./conversation.model";



export const getConversation = async (req: Request, res: Response) => {
  const { placeId, userId } = req.query;

  try {
    const result = await Conversation.findOne({ placeId, userId });
    if (result) return res.send(result);

    res.status(404).send({ message: "Conversation not found" });
  } catch (err) {
    res.status(500).send({ message: err });
  }
};

export const toggleUser = async (req: Request, res: Response) => {
  const { userId, placeId } = req.params;
  try {
    const result = await Conversation.findOneAndUpdate(
      { userId, placeId },
      { $set: { isActive: { $eq: [false, "$isActive"] } } }
    );
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

export const getChatPartners = async (req, res: Response) => {
  try {
    
    // Assuming req.user._id contains the authenticated user's ID
    const userId: mongoose.Types.ObjectId = req.user.userId;

    // Find all conversations where the authenticated user is a participant
    const conversations = await Conversation.find({ users: userId }).populate('users', '-password');

    let users:IUser[] = [];
    conversations.forEach(conversation => {
      // Iterate over each conversation's users array
      conversation.users.forEach((user:any) => {
        // If the user is not the authenticated user and not already included, add them to the users array
        if (user._id.toString() !== userId.toString() && !users.some((u:any) => u._id.toString() === user._id.toString())) {
          users.push(user);
        }
      });
    });

    res.json(users); // Returns a list of users (with their data) the authenticated user had a conversation with
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};








