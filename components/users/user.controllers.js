import fs from "fs";
import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
// import cookieParser from "cookie-parser";
const secret="mySecret"



export const allUsers = async (req, res) => {
    let data = fs.readFileSync('store.json');
    data = JSON.parse(data);
    res.send(data)
};

export const addUser = async (req, res) => {
  fs.readFile("store.json", "utf8", async function (err, data) {
    if (err) {
      res.status(500).send({ error: "Failed to read file" });
    } else {
      const users = data ? JSON.parse(data) : [];
      const hashedPassword = await  bcrypt.hash(req.body.password, 8);
      console.log(hashedPassword);
      const userHashed = ({
        email: req.body.email,
        password: hashedPassword,
    });
      users.push(userHashed);
      console.log(users);

      fs.writeFile("store.json", JSON.stringify(users), function (err) {
        if (err) {
          res.status(500).send({ error: "Failed to add user" });
        } else {
          res.status(200).send({ message: "User added successfully" });
        }
      });
    }
  });
};






export const login = async (req, res) => {
  fs.readFile("store.js", "utf8", function (err, data) {
    if (err) {
      res.status(500).send({ error: "Failed to read file" });
    } else {
      const users = data ? JSON.parse(data) : [];
      const user = users.find((u) => u.email === req.body.email);
      if(!user){
        res.status(500).send({ error: "Email not found" });
      }
      else if(user.password!=req.body.password){
        res.status(500).send({ error: "incorrect password " });
      }
      else{
       const token=Jwt.sign({email:user.email},secret,{ expiresIn: '1h' })
       res.status(200).send({ message: "Successfully logged in", token });

      }
    }
  });
};

export const authenticate = async (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) {
      res.status(401).send({ error: "No token provided" });
    } else {
      try {
        const decoded = Jwt.verify(token, secret);
        req.user = decoded;
        next(); 
      } catch (err) {
        res.status(401).send({ error: "Invalid token" });
      }
    }
  };
  export const deleteUser = async (req, res) => {
    let data = fs.readFileSync('store.json');
    data = JSON.parse(data);
    data = data.filter(user => user.email !==  "bob@test.com");
    fs.writeFileSync('store.json', JSON.stringify(data));
  }