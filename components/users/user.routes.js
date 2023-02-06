import { Router } from "express";
import { addUser, authUser } from "./user.controllers.js";
// import router from "../users/user.models";

const router = Router();

// router.get("/example/:exampleParam",example);

router.get("/user", authUser);
router.post("/user/add", addUser);

export default router;