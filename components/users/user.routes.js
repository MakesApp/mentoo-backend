import { Router } from "express";
import {  allUsers, findUserById, login, register } from "./user.controllers.js";

const router = Router();



router.get("/users", allUsers);
router.get("/user/:id", findUserById);
router.post("/user/register", register);
router.post("/user/login", login);
export default router;