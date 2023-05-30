import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import User, { IUser }  from "./user.models";
import { jwtSecret } from "../../config/jwtConfig";
import { base } from "../../services/Airtable/AirtableConfig";



export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  try {
    if (!email || !password) {
      return res.status(409).json({ message: "אחד השדות חסרים" });
    }

    // Check if the email is already registered in Airtable
    const usersInAirtable = await base('contacts').select({
      filterByFormula: `{Email} = '${email}'`,
    }).all();

    if (usersInAirtable.length === 0) {
      return res.status(409).json({ message: "איימיל זה לא קיים במאגר המתנדבים" });
    }

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
        message: "ההתחברות נכשלה: איימיל לא קיים , צריך להירשם",
      });
    } else {
      const matchPassword = await bcrypt.compare(password, user.password);
      if (matchPassword) {
        const token = jwt.sign({ userId:user._id ,role:user.role}, jwtSecret, {
          expiresIn: "1h",
        });
        const modifiedUser = { role:user.role,...user.toObject(), password: undefined };

     res.cookie("token", token, { httpOnly: true, secure: true });

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
  console.log(req.user);
  

  try {
    const user = await User.findById(userId);

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
