import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import User  from "./user.models";
import { jwtSecret } from "../../config/jwtConfig";

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Check if the email is already registered
    if (!email || !password) {
      return res.status(409).json({ error: "Missing Credentials" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already registered" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    // Generate a JWT
    const token = jwt.sign({ userId: newUser._id }, jwtSecret, {
      expiresIn: "1d",
    });

    // Set the token as a cookie
    res.cookie("token", token, { httpOnly: true, secure: true });

    res.status(201).json({ user: savedUser, message: "Registration successful" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
};


export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.send({
        message: "Login failed: email doesn't exist, register first",
      });
    } else {
      const matchPassword = await bcrypt.compare(password, user.password);
      if (matchPassword) {
        const token = jwt.sign({ email }, jwtSecret, {
          expiresIn: "1h",
        });

        res.cookie("token", token, { httpOnly: true });
        res.status(200).send({ message: "Login successful", user });
      } else {
        res.status(401).send({ message: "Login failed: Incorrect password" });
      }
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
};
