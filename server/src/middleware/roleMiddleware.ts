import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: any; 
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  let token: string | undefined = req.headers.authorization;

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

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== "admin") {
    res.status(403).json({ message: "Access denied, admins only" });
    return;
  }
  next();
};
