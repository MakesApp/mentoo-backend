import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { jwtSecret } from "../config/jwtConfig";

interface RequestWithUser extends Request {
  user?: jwt.JwtPayload | string;
}

const authMiddleware = (req: RequestWithUser, res: Response, next: NextFunction): void => {
  
  const token = req.cookies.token;
  
  if (!token) {
    res.status(401).json({ message: "No token, authorization denied." });
    return;
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);

    // Add user from payload
    req.user = decoded;
    next();
  } catch (e) {
    res.status(400).json({ message: "Token is not valid" });
  }
};

export default authMiddleware;
