"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Mail, Lock, Eye, EyeOff, Users, Loader2 } from "lucide-react";
import { signupWithEmail } from "@/services/auth.service";
import axios from "axios";
import { PreviewCard } from "@base-ui/react";

export default function AuthRegister() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.gender) {
      setError("Please select your gender");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const data = await signupWithEmail(formData);
      if (data) {
        router.push("/login");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Registration failed! Try again.");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-[95%] sm:max-w-xl md:max-w-2xl mx-auto bg-white/25 backdrop-blur-2xl border border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.2)] shadow-amber-500/10 rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 text-gray-900 transition-all duration-300">
      
      <CardHeader className="text-center space-y-1 pb-3 p-0">
        <CardTitle className="text-3xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-amber-500 via-rose-500 to-amber-600 bg-clip-text text-transparent drop-shadow-sm">
          Welcome To KthnX..!
        </CardTitle>

        <CardDescription className="text-slate-800 font-bold text-xs sm:text-base">
          Create an account here to get started and enjoy your life!
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3.5 sm:space-y-4 flex flex-col items-center w-full p-0">
        
        {error && (
          <div className="w-[96%] sm:w-[92%] p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/50 text-rose-800 font-bold text-center text-xs sm:text-sm backdrop-blur-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center space-y-3.5 sm:space-y-4">
          
          <div className="w-[96%] sm:w-[92%] flex flex-col gap-1">
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 text-amber-700/80 group-focus-within:text-amber-600 transition-colors pointer-events-none" />
              <Input 
                name="name"
                type="text" 
                required
                placeholder="Enter your full name"
                className="pl-12 sm:pl-14 h-12 sm:h-13 text-lg sm:text-xl font-bold bg-white/50 border border-white/60 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:bg-white/80 rounded-xl sm:rounded-2xl text-slate-900 placeholder:text-slate-500/80 shadow-sm transition-all"
                value={formData.name}
                onChange={(e) => setFormData((prev)=>({...prev, name: e.target.value}))}
              />
            </div>
          </div>

          <div className="w-[96%] sm:w-[92%] flex flex-col gap-1">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 text-amber-700/80 group-focus-within:text-amber-600 transition-colors pointer-events-none" />
              <Input 
                name="email"
                type="email" 
                required
                placeholder="Enter your email"
                className="pl-12 sm:pl-14 h-12 sm:h-13 text-lg sm:text-xl font-bold bg-white/50 border border-white/60 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:bg-white/80 rounded-xl sm:rounded-2xl text-slate-900 placeholder:text-slate-500/80 shadow-sm transition-all"
                value={formData.email}
                onChange={(e) => setFormData((prev)=>({...prev, email: e.target.value}))}
              />
            </div>
          </div>

          <div className="w-[96%] sm:w-[92%] flex flex-col gap-1">
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 text-amber-700/80 group-focus-within:text-amber-600 transition-colors pointer-events-none" />
              <Input 
                name="password"
                type={showPassword ? "text" : "password"} 
                required
                placeholder="Create a password"
                className="pl-12 sm:pl-14 pr-12 sm:pr-14 h-12 sm:h-13 text-lg sm:text-xl font-bold bg-white/50 border border-white/60 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:bg-white/80 rounded-xl sm:rounded-2xl text-slate-900 placeholder:text-slate-500/80 shadow-sm transition-all"
                value={formData.password}
                onChange={(e) => setFormData((prev)=>({...prev, password: e.target.value}))}
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

          <div className="w-[96%] sm:w-[92%] flex flex-col gap-1.5">
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: "male", label: "Male", activeBg: "#f59e0b", activeBorder: "#d97706" },
                { id: "female", label: "Female", activeBg: "#f43f5e", activeBorder: "#e11d48" },
              ].map((item) => {
                const isSelected = formData.gender === item.id;
                return (
                  <motion.button
                    key={item.id}
                    type="button"
                    whileTap={{ scale: 0.96 }}
                    animate={{
                      backgroundColor: isSelected ? item.activeBg : "rgba(255, 255, 255, 0.4)",
                      borderColor: isSelected ? item.activeBorder : "rgba(255, 255, 255, 0.6)",
                      color: isSelected ? "#ffffff" : "#334155",
                      scale: isSelected ? 1.02 : 1,
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    onClick={(e) => {
                      e.preventDefault();
                      setFormData((prev) => ({ ...prev, gender: item.id }));
                      setError(null);
                    }}
                    className="h-9 sm:h-10 rounded-lg sm:rounded-xl font-black text-xs sm:text-sm border shadow-sm flex items-center justify-center cursor-pointer select-none"
                  >
                    {item.label}
                  </motion.button>
                );
              })}
            </div>
          </div>

          <Button 
            type="submit"
            disabled={loading}
            className="w-[96%] sm:w-[92%] h-12 sm:h-13 mt-1 bg-gradient-to-r from-amber-400 via-rose-500 to-amber-500 hover:from-amber-500 hover:via-rose-600 hover:to-amber-600 text-white font-black text-xl sm:text-2xl rounded-xl sm:rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Creating Account...
              </>
            ) : (
              "Sign Up"
            )}
          </Button>

        </form>

        <div className="pt-1 flex items-center justify-center gap-2 text-sm sm:text-lg font-bold text-slate-800">
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
  );
}