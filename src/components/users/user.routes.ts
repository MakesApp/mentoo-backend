import { Router } from "express";
import authMiddleware from "../../auth/authMiddleWare";
import { register,login, getUser, logout, getListOfUsers } from "./user.controllers";

const router = Router();



router.post("/user/register", register);
router.post("/user/login", login);
router.get("/user/auth",authMiddleware,getUser)
router.get("/user/logout",authMiddleware,logout)
router.post("/user/getUsers",authMiddleware,getListOfUsers)
export default router;