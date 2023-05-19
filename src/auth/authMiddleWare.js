import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../../config/jwtConfig";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Authorization token missing" });
  }

  try {
    // Verify the token
    const decodedToken: any = jwt.verify(token, jwtSecret);
    req.userId = decodedToken.userId;

    next();
  } catch (error) {
    console.error("Authorization error:", error);
    res.status(401).json({ error: "Invalid token" });
  }
};

export default authMiddleware;
