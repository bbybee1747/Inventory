import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  let token = req.headers.authorization;

  if (!token || !token.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized, no token" });
    return;
  }

  try {
    token = token.split(" ")[1]; 
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized, invalid token" });
  }
};
