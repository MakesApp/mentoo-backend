import { Router } from "express";
import { addUser, allUsers, authenticate, deleteUser, login } from "./user.controllers.js";
// import router from "../users/user.models";

const router = Router();
// router.use(authenticate)


router.get("/users", allUsers);
router.post("/user/register", addUser);
router.post("/user/login", login);
router.delete("/user/delete", deleteUser);

export default router;