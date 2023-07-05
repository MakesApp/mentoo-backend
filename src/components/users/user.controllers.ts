import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import User, { IUser }  from "./user.models";
import { jwtSecret } from "../../config/jwtConfig";
// import { base } from "../../services/Airtable/AirtableConfig";
import mongoose from "mongoose";
import Conversation from "../conversations/conversation.model";



export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  try {
    if (!email || !password) {
      return res.status(409).json({ message: "אחד השדות חסרים" });
    }

    // Check if the email is already registered in Airtable
    // const usersInAirtable = await base('contacts').select({
    //   filterByFormula: `{Email} = '${email}'`,
    // }).all();

    // if (usersInAirtable.length === 0) {
    //   return res.status(409).json({ message: "איימיל זה לא קיים במאגר המתנדבים" });
    // }

    // Check if the email is already registered in MongoDB
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "איימיל זה  קיים במערכת" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in MongoDB
    const newUser = new User({
      email,
      password: hashedPassword,
      role:'volunteer'
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    // Generate a JWT
    const token = jwt.sign({ userId: newUser._id,role:'volunteer' }, jwtSecret, {
      expiresIn: "1d",
    });

    // Set the token as a cookie
    res.cookie("token", token, { httpOnly: true, secure: true });

    res.status(201).json({ user: savedUser, message: "ההרשמה בוצעה בהצלחה" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "ההרשמה נכשלה" });
  }
};


export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
console.log(email, password);

  try {
      if (!email || !password) {
      return res.status(409).json({ message: "אחד השדות חסרים" });
    }
    // // Check if the email is already registered in Airtable
    // const usersInAirtable = await base('contacts').select({
    //   filterByFormula: `{Email} = '${email}'`,
    // }).all();

    // if (usersInAirtable.length === 0) {
    //   return res.status(409).json({ message: "איימיל זה לא קיים במאגר המתנדבים" });
    // }
    const user = await User.findOne({ email });
    if (!user) {
       res.status(400).send({
        message: "ההתחברות נכשלה: איימיל או סיסמה לא תקינים",
      });
    } else {
      const matchPassword = await bcrypt.compare(password, user.password);
      if (matchPassword) {
        const token = jwt.sign({ userId:user._id ,role:user.role}, jwtSecret, {
          expiresIn: "1h",
        });
        const modifiedUser = { role:user.role,...user.toObject(), password: undefined };

     res.cookie("token", token, { httpOnly: true, secure: false ,sameSite: 'lax' // none, lax, or strict
});

        res.status(200).send({ message: "ההתחברות בוצעה בהצלחה", user:modifiedUser ,token});
      } else {
        res.status(401).send({ message: "ההתחברות נכשלה :סיסמה שגויה" });
      }
    }
  } catch (error) {
    res.status(500).json({ error: "ההתחברות נכשלה" });
  }
};



export const getUser = async (req, res: Response): Promise<void> => {
  const { userId } = req.user;
  

  try {
  const user = await User.findById(userId)
 

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Don't send the password back
    const userResponse: Partial<IUser> = user.toObject();
    userResponse.password = undefined;

    res.json(userResponse);
  } catch(err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching user' });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    // Clear the token cookie
    res.clearCookie("token");

    res.status(200).json({ message: "התנתקות בוצעה בהצלחה" }); // Logged out successfully
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "התנתקות נכשלה" }); // Logout failed
  }
};

export const getListOfUsers= async (req: Request, res: Response) => {
 const { list } = req.body;

try {
  const users = await Promise.all(
    list.map(async (user) => {
      const conversation = await Conversation.findOne({ users: user }).populate("transcript.sender");

      if (!conversation) {
        const userData = await User.findById(user).select("-password"); // Assuming you have a User model
        if(userData)
        return {
          ...userData.toObject(),
          hasUnreadMessages: false,
        };
      }
      const unreadMessages = conversation?.transcript.filter((message) => !message.seenBy);

      const userData = await User.findById(user).select("-password"); // Assuming you have a User model
      if(userData)
      return {
        ...userData.toObject(),
        hasUnreadMessages:unreadMessages? unreadMessages.length > 0:false,
      };
    })
  );

  res.status(200).json({ users });
} catch (error) {
  console.error("Fetching users error:", error);
  res.status(500).json({ error: "כשל במשיכת הנתונים" });
}

}

export const checkUnreadMessages = async (req, res: Response) => {
  try {
    // Extract user ID, modify this based on your authentication setup
    const userId: mongoose.Types.ObjectId = req.user.userId;

    // Find a conversation where the user is a participant, they are not the sender,
    // and they have not seen the message
    const conversation = await Conversation.findOne({
      users: userId,
      transcript: {
        $elemMatch: {
          sender: { $ne: userId },
          seenBy: { $ne: userId }
        }
      }
    });

    // If such a conversation exists, the user has unread messages
    const hasUnreadMessages = Boolean(conversation);
    return res.status(200).json({hasUnreadMessages});

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
}

export const getUserById = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {

    const user = await User.findById(userId).populate('placeId').select("-password");

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};
