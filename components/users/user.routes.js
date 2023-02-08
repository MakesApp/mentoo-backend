import { Router } from "express";
import {  allUsers, findUserById, login, register } from "./user.controllers.js";
// import router from "../users/user.models";

const router = Router();
// router.use(authenticate)


// router.post("/user/addUser", addUserToMongoDb);

router.get("/users", allUsers);
router.get("/user/:id", findUserById);
router.post("/user/register", register);
router.post("/user/login", login);
export default router;