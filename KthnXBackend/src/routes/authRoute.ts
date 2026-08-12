import { Router } from "express";
import { getUserProfile, loginWithPassword, singinWithGoogle, singupWithEmail, updateUserProfile } from "../Controllers/authController.js";
import { protectRouter } from "../Middlewares/authMiddleware.js";

const router = Router()

router.post('/signup',singupWithEmail)
router.post('/singinWithGoogle',singinWithGoogle)
router.post('/login',loginWithPassword)
router.get('/profile',protectRouter,getUserProfile)
router.put('/update',protectRouter,updateUserProfile)

export default router
