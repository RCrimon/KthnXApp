import type { NextFunction, Request, Response } from "express";
import { Socket } from "socket.io";
import jwt, { type Secret } from "jsonwebtoken";
import { User } from "../model/user.model.js";

export interface Userpayload {
  id: string;
}

export interface CustomRequest extends Request {
  user?: {
    name: string;
    id: string;
    email: string;
  };
}


export const protectRouter = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token found" });
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET as Secret;

    if (!token || !secret) {
      return res.status(401).json({ message: "Unauthorized: Missing token" });
    }

    const decoded = jwt.verify(token, secret) as unknown as Userpayload;
    const user = await User.findById(decoded.id).select("-password").lean();
    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};


export const socketAuth = async (
  socket: Socket,
  next: (err?: Error) => void
) => {
  try {
    let token = socket.handshake.auth?.token;

    if (!token && socket.handshake.headers?.cookie) {
      const cookies = socket.handshake.headers.cookie.split(";");
      const tokenCookie = cookies.find((c) => c.trim().startsWith("token="));
      if (tokenCookie) {
        token = tokenCookie.split("=")[1];
      }
    }

    if (!token) {
      return next(new Error("Authentication error: Token not found!"));
    }

    const secret = process.env.JWT_SECRET as Secret;
    const decoded = jwt.verify(token, secret) as unknown as Userpayload;

    const user = await User.findById(decoded.id)
      .select("name email gender interestedIn")
      .lean();

    if (!user) {
      return next(new Error("Authentication error: User record not found"));
    }

    socket.data.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      gender: user.gender || "Male",      
      interestedIn: user.interestedIn || "Both", 
    };

    next();
  } catch (err: any) {
    console.error("Socket Auth Error:", err.message);
    next(new Error("Authentication error: Invalid Token!"));
  }
};