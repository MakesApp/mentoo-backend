import fs from "fs";

export const authUser = async (req, res) => {
  console.log(req.params);
  return res.send("auth");
};


    export const addUser = async (req, res) => {
        fs.readFile("store.json", "utf8", function (err, data) {
          if (err) {
            res.status(500).send({ error: "Failed to read file" });
          } else {
            const users = data ? JSON.parse(data) : [];
            users.push(req.body);
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
      
      
      
      
