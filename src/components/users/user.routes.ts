import { Router } from "express";
import { register,login } from "./user.controllers";

const router = Router();



router.post("/user/register", register);
router.post("/user/login", login);
export default router;