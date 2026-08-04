"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {User, Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function authRegister() {
  const [showPassword, setShowPassword] = useState(false);
  return (
        <Card className="w-full max-w-[95%] sm:max-w-xl md:max-w-2xl mx-auto bg-white/25 backdrop-blur-2xl border border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.2)] shadow-amber-500/10 rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-8 text-gray-900 transition-all duration-300">
      
      <CardHeader className="text-center space-y-2 pb-6 p-0">

        <CardTitle className="text-3xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-amber-500 via-rose-500 to-amber-600 bg-clip-text text-transparent drop-shadow-sm">
          Welcome To KthnX..!
        </CardTitle>

        <CardDescription className="text-slate-800 font-bold text-sm sm:text-lg">
         Create an account here to get started and enjoy your life!
        </CardDescription>
      </CardHeader>

   
     <CardContent className="space-y-5 sm:space-y-6 flex flex-col items-center w-full p-0">
        
        {/* 👤 ১. Full Name Input (নতুন যোগ করা হয়েছে) */}
        <div className="w-[96%] sm:w-[92%] flex flex-col gap-1.5">
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 text-amber-700/80 group-focus-within:text-amber-600 transition-colors pointer-events-none" />
            
            <Input 
              type="text" 
              placeholder="Enter your full name"
              className="pl-12 sm:pl-14 h-13 sm:h-14 text-lg sm:text-xl font-bold bg-white/50 border border-white/60 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:bg-white/80 rounded-xl sm:rounded-2xl text-slate-900 placeholder:text-slate-500 shadow-sm transition-all"
            />
          </div>
        </div>

        {/* ✉️ ২. Email Input */}
        <div className="w-[96%] sm:w-[92%] flex flex-col gap-1.5">
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 text-amber-700/80 group-focus-within:text-amber-600 transition-colors pointer-events-none" />
            
            <Input 
              type="email" 
              placeholder="Enter your email"
              className="pl-12 sm:pl-14 h-13 sm:h-14 text-lg sm:text-xl font-bold bg-white/50 border border-white/60 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:bg-white/80 rounded-xl sm:rounded-2xl text-slate-900 placeholder:text-slate-500 shadow-sm transition-all"
            />
          </div>
        </div>

        {/* 🔒 ৩. Password Input */}
        <div className="w-[96%] sm:w-[92%] flex flex-col gap-1.5">
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 text-amber-700/80 group-focus-within:text-amber-600 transition-colors pointer-events-none" />
            
            <Input 
              type={showPassword ? "text" : "password"} 
              placeholder="Create a password"
              className="pl-12 sm:pl-14 pr-12 sm:pr-14 h-13 sm:h-14 text-lg sm:text-xl font-bold bg-white/50 border border-white/60 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:bg-white/80 rounded-xl sm:rounded-2xl text-slate-900 placeholder:text-slate-500 shadow-sm transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-5 h-5 sm:w-6 sm:h-6" /> : <Eye className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>

        {/* 🚀 ৪. Sign Up Button */}
        <Button 
          className="w-[96%] sm:w-[92%] h-13 sm:h-14 mt-2 bg-gradient-to-r from-amber-400 via-rose-500 to-amber-500 hover:from-amber-500 hover:via-rose-600 hover:to-amber-600 text-white font-black text-xl sm:text-2xl rounded-xl sm:rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-amber-500/25"
        >
          Sign Up
        </Button>

        {/* 🔗 ৫. Login Link (লগইন পেজে ফিরে যাওয়ার লিংক) */}
        <div className="pt-3 flex items-center justify-center gap-2 text-sm sm:text-lg font-bold text-slate-800">
          <span>Already have an account?</span>
          <Link 
            href="/login" 
            className="font-black text-sm sm:text-lg text-amber-700 hover:text-rose-600 hover:underline transition-all cursor-pointer"
          >
            Login
          </Link>
        </div>

      </CardContent>

    </Card>
  )
}
