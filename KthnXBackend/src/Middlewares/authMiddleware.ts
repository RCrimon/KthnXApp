import type { NextFunction, Request, Response } from "express";
import {Socket} from 'socket.io'

import jwt from "jsonwebtoken";
import { User } from "../model/user.model.js";

export interface Userpayload {
  id : string
}

export interface CustomRequest extends Request {
 user?:{
  name:string,
  id:string,
  email:string,
 }
}


export const protectRouter = async (req:CustomRequest,res:Response,next:NextFunction)=>{
  
  try {
   const authHeader = req.headers.authorization
   if(!authHeader || !authHeader.startsWith('Bearer ')){
    return res.status(401).json({ message: 'Not authorized, no token found' })
   }
   const token = authHeader?.split(' ')[1]
   const decoded = jwt.verify(token as string ,process.env.JWT_SECRET as string) as Userpayload
   const user = await User.findById(decoded.id).select('-password')
   if(!user){
    return res.status(401).json({ message: 'User no longer exists inside database engine' })
   }
   
   req.user ={
    id : user._id.toString(),
    name : user.name,
    email : user.email
   }
   next()
  } catch (error) {
    console.error("Auth System Middleware Crash Protection Triggered:", error);
    return res.status(401).json({ message: 'Not authorized, token validation failed or session expired' });
  }
}

export const socketAuth = async (socket:Socket, next:(err?:Error)=>void)=>{
  try {
    const token = socket.handshake.auth.token
    if(!token){
      return next(new Error('Authentication error: Token missing'))
    }

    const decoded = jwt.verify(token,process.env.JWT_SECRET as string) as {id:string}
    const user = await User.findById(decoded.id).select("gender interestedIn")
    if(!user){
      return next(new Error('user not found'))
    }
    socket.data.user = {
      _id: user._id.toString(),
      gender: user.gender,
      interestedIn: user.interestedIn
    };
    next()
  } catch (error) {
    return next(new Error('invalid token'))
  }
}