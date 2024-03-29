import { Router } from "express";
import authMiddleware from "../../auth/authMiddleware";
import { register,login, getUser, logout, getListOfUsers, checkUnreadMessages, getUserById, updateVolunteerList } from "./user.controllers";

const router = Router();



router.post("/user/register", register);
router.post("/user/login", login);
router.get("/user/auth",authMiddleware,getUser)
router.get("/user/logout",authMiddleware,logout)
router.post("/users/getUsers",authMiddleware,getListOfUsers)
router.get("/user/has-unread-messages",authMiddleware, checkUnreadMessages);
router.get("/user/:userId",authMiddleware, getUserById);
router.patch("/user/:userId", authMiddleware,updateVolunteerList);

export default router;