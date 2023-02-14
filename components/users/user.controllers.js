import { Users } from "./user.models.js";
import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExist = await Users.findOne({ email });
    if (userExist) {
      return res.status(409).send("User Already Exist. Please Login");
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new Users({
        email: req.body.email,
        password: hashedPassword,
      });

      const savedUser = await user.save();
      res.status(201).send(savedUser);
      console.log(savedUser);
    }
  } catch (e) {
    res.status(400).send(e);
  }
};

export const findUserById = async (req, res) => {
  const _id = req.params.id;

  try {
    const user = await Users.findById(_id);

    if (!user) {
      return res.status(404).send();
    }

    res.send(user);
  } catch (e) {
    res.status(500).send();
  }
};

export const allUsers = async (req, res) => {
  const users = await Users.find({});
  try {
    res.status(200).send({users:users});
  } catch (err) {
    res.send(err.message);
  }
};
console.log("change");
export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await Users.findOne({ email });
  if (!user) {
    res.send({ message: "Login failed:  email don't exist, register first" });
  } else {
    const matchPassword = await bcrypt.compare(password, user.password);
    if (matchPassword) {
      const token = Jwt.sign({ email: email }, process.env.TOKEN_SECRET, {
        expiresIn: "1h",
      });

      res.cookie("token", token, { httpOnly: true });
      res.status(200).send({ message: "Login successful", user });
    } else {
      res
        .status(401)
        .send({ message: "Login failed: Incorrect password" });
    }
  }
  
};
