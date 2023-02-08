import { Users } from "./user.models.js";
// import fs from "fs";
import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
// import uniqid from "uniqid";
import dotenv from "dotenv";
dotenv.config();

// import cookieParser from "cookie-parser";

export const register = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new Users({
      email: req.body.email,
      password: hashedPassword,
    });

    const savedUser = await user.save();
    res.status(201).send(savedUser);
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
    res.status(200).send(users);
  } catch (err) {
    res.send(err.message);
  }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await Users.findOne({ email });

    const emailMongo=user.email
    const match = await bcrypt.compare(password, user.password);

  if (email === emailMongo && match) {
    const token = Jwt.sign({ email: email },  process.env.TOKEN_SECRET, { expiresIn: "1h" });
    res.cookie("token", token, { httpOnly: true });
    res.status(200).send({ message: "Login successful" });
  } else {
    res
      .status(401)
      .send({ message: "Login failed: Invalid email or password" });
  }
};

// export const login = async (req, res) => {
//   try {
//     // Get user input
//     const { email, password } = req.body;

//     // Validate user input
//     if (!(email && password)) {
//       res.status(400).send("All input is required");
//     }
//     // // Validate if user exist in our database
//     const user = await Users.findOne({ email });
//     console.log(user);
//     if (user && (await bcrypt.compare(password, user.password))) {
//       // Create token
//       const token = Jwt.sign(
//         { user_id: user._id, email },
//         process.env.TOKEN_SECRET,
//         {
//           expiresIn: "1h",
//         }
//       );
//       res.send(token);
//     }
//   } catch (err) {
//     console.log(err);
//   }
//   // Our register logic ends here
// };

// export const authenticate = async (req, res, next) => {};

// export const deleteUser = async (req, res) => {
//   let data = fs.readFileSync("store.json");
//   data = JSON.parse(data);
//   data = data.filter((user) => user.email !== "bob@test.com");
//   fs.writeFileSync("store.json", JSON.stringify(data));
// };

// export const login = async (req, res) => {
//   fs.readFile("store.json", "utf8", function (err, data) {
//     if (err) {
//       res.status(500).send({ error: "Failed to read file" });
//     } else {
//       const users = data ? JSON.parse(data) : [];
//       const user = users.find((u) => u.id === req.body.id);
//       if (!user) {
//         res.status(500).send({ error: "Email not found" });
//       } else if (user.password != req.body.password) {
//         res.status(500).send({ error: "incorrect password " });
//       } else {
//         const token = Jwt.sign({ email: user.email }, secret, { expiresIn: "1h",});
//         console.log(token);
//         res.status(200).send({ message: "Successfully logged in", token });
//       }
//     }
//   });
// };

// export const register = async (req, res) => {
//   fs.readFile("store.json", "utf8", async function (err, data) {
//     if (err) {
//       res.status(500).send({ error: "Failed to read file" });
//     } else {
//       const users = data ? JSON.parse(data) : [];
//       const hashedPassword = await bcrypt.hash(req.body.password, 8);
//       const userHashed = {
//         id: uniqid(),
//         email: req.body.email,
//         password: hashedPassword,
//       };
//       users.push(userHashed);
//       //   console.log(users);

//       fs.writeFile("store.json", JSON.stringify(users), function (err) {
//         if (err) {
//           res.status(500).send({ error: "Failed to add user" });
//         } else {
//           res.status(200).send({ message: "User added successfully" });
//         }
//       });
//     }
//   });
// };
