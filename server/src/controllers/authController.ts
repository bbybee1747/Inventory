import { NextFunction, Request, Response } from "express";
import User, { IUser, UserRole } from "../models/User";
import jwt from "jsonwebtoken";

const generateToken = (user: IUser) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET as string, {
    expiresIn: "1d",
  });
};

// **Register User**
export const registerUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { username, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
     res.status(400).json({ message: "User already exists" });
     return;
    }

    if (role === UserRole.ADMIN) {
      res.status(400).json({ message: "Only admins can create admin accounts" });
      return;
    }

    // Create new user
    const newUser = new User({ username, email, password, role });
    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      token: generateToken(newUser),
    });
  } catch (error) {
   res.status(500).json({ message: "Error registering user" });
   return;
  }
};

// **Login User**
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    // Validate password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials" });
      
    }

    res.json({
      message: "Login successful",
      token: generateToken(user),
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in" });
  }
};
