import type {Request,Response} from 'express'
import type {CustomRequest} from '../Middlewares/authMiddleware.js'
import { User } from '../model/user.model.js';
import bcrypt from 'bcryptjs';
import {OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken'


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

export const singupWithEmail = async (req: Request , res : Response)=>{
  try {  
    const {name,email,password} = req.body
  if(!name || !email ||!password){
    return res.json('requerd all filed').status(400)
  }
    const users = await User.findOne({email})
    if(users){
     return res.json('user allready exies').status(400)
    }
    const hashPassword = await bcrypt.hash(password,10)
    const newUser = await User.create({
        name,
        email,
        password : hashPassword,
        authProvider:'local'
      })
      return res.json({
        user:{
          id:  newUser._id,
          name:  newUser.name,
          email :  newUser.email
        }
      })
    
  } catch (error: any) {
    console.error("CRITICAL SIGNUP ERROR:", error);
    return res.status(500).json({
      message: 'Internal Server Error',
    });
  }
}

export const singinWithGoogle = async (req: Request, res: Response) =>{
  try {
    const {token} = req.body
    if(!token){
      return res.status(400).json('Google token is required')
    }
    const ticket = await client.verifyIdToken({
      idToken : token as string,
      audience : process.env.GOOGLE_CLIENT_ID ?? '',
    })

    const payload = ticket.getPayload()
    if(!payload){
      return res.status(400).json('Invalid Google token')
    }

    const {email,name,picture} = payload
    let user = await User.findOne({email : email as string})

    if(!user){
      user = await User.create({
        name : name as string,
        email : email as string,
        picture : picture as string,
        authProvider: 'google',
      })
    }else if(user.authProvider !== 'google'){
      return res.status(400).json('This email is already registered with password login')
    }

    return res.status(200).json({
      message:'Google Sign-In successful',
      user: {
        id: user._id,
        name : user.name,
        email : user.email,
        picture : user.picture,
      }
    })
  } catch (error) {
    console.error("Google Auth Error:", error);
    return res.status(500).json('Google Authentication failed');
  }
  
}

export const loginWithPassword = async (req: Request, res: Response)=>{
 try {
  const {email ,password} = req.body
  if(!email || !password ){
    return res.status(400).json('All fields are required')
  }
 const user = await User.findOne({email}).select('+password')

 if(!user){
  return res.status(400).json('Invalid email or password');
 }
if(user.authProvider === 'google'){
  return res.status(400).json('Please login with Google')
 }
 const userPass = await bcrypt.compare(password,user?.password as string)
 if(!userPass){
  return res.status(400).json('Invalid email or password');
 }

 const token = jwt.sign({id:user._id},process.env.JWT_SECRET as string,{expiresIn : '7d'})

 return res.status(200).json({
  token,
  user:{
    id : user._id,
    name : user.name,
    email : user.email,
    picture : user.picture
  }
})

 } catch (error: any) {
    console.error("CRITICAL LOGIN ERROR:", error);
    return res.status(500).json({
      message: 'Internal Server Error',
    });
  }
}

export const getUserProfile = async (req: CustomRequest, res: Response)=>{
  try {
    return res.status(200).json({user:req.user, success:true})
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

export const updateUserProfile = async (req: CustomRequest, res:Response)=>{
  try {
    const userId = req.user?.id
    const {name,email} = req.body
    const upDateUser = await User.findByIdAndUpdate(userId,{name,email},{new:true}).select('-password')
    return res.status(200).json({success: true,user:upDateUser})
  } catch{
    return res.status(500).json({success: false, massage: 'error massage'})
  }
}