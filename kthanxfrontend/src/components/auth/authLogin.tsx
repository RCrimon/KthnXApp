"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { loginWithPassword } from "@/services/auth.service";
import GoogleLoginBtn from "@/components/GoogleLoginBtn"; 
import axios from "axios";

export default function AuthLogin() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await loginWithPassword(formData); 
      if (data.token) {
        login(data.token);
        router.push("/dashboard");
      } else {
        setError(data.message || "Login failed! please try again");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Invalid email or password");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-[95%] sm:max-w-xl md:max-w-2xl mx-auto bg-white/25 backdrop-blur-2xl border border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.2)] shadow-amber-500/10 rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-8 text-gray-900 transition-all duration-300">
      
      <CardHeader className="text-center space-y-2 pb-6 p-0">
        <CardTitle className="text-3xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-amber-500 via-rose-500 to-amber-600 bg-clip-text text-transparent drop-shadow-sm">
          Welcome To KthnX..!
        </CardTitle>
        <CardDescription className="text-slate-800 font-bold text-sm sm:text-lg">
          Login here to access your account
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5 sm:space-y-6 flex flex-col items-center w-full p-0">
        {error && (
          <div className="w-[96%] sm:w-[92%] p-3 rounded-xl bg-rose-500/20 border border-rose-500/50 text-rose-800 font-bold text-center text-sm sm:text-base backdrop-blur-md">
            {error}
          </div>
        )}
   
        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center space-y-5 sm:space-y-6">
          <div className="w-[96%] sm:w-[92%] flex flex-col gap-1.5">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 text-amber-700/80 pointer-events-none" />
              <Input 
                type="email" 
                required
                placeholder="Enter your email"
                className="pl-12 sm:pl-14 h-13 sm:h-14 text-lg font-bold bg-white/50 border border-white/60 rounded-xl text-slate-900"
                value={formData.email}
                onChange={(e)=> setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="w-[96%] sm:w-[92%] flex flex-col gap-1.5">
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 text-amber-700/80 pointer-events-none" />
              <Input 
                type={showPassword ? "text" : "password"} 
                required
                placeholder="Enter your password"
                className="pl-12 sm:pl-14 pr-12 h-13 sm:h-14 text-lg font-bold bg-white/50 border border-white/60 rounded-xl text-slate-900"
                value={formData.password}
                onChange={(e)=> setFormData({...formData, password: e.target.value})}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <Button 
            type="submit"
            disabled={loading}
            className="w-[96%] sm:w-[92%] h-13 sm:h-14 mt-2 bg-gradient-to-r from-amber-400 via-rose-500 to-amber-500 text-white font-black text-xl sm:text-2xl rounded-xl shadow-lg"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Login"}
          </Button>
        </form>

        {/* OR Divider */}
        <div className="w-[96%] sm:w-[92%] flex items-center my-2">
          <div className="flex-1 border-t border-slate-400/50"></div>
          <span className="px-3 text-slate-700 font-bold text-sm">OR</span>
          <div className="flex-1 border-t border-slate-400/50"></div>
        </div>


        <GoogleLoginBtn setError={setError} setLoading={setLoading} />

        <div className="pt-3 flex items-center justify-center gap-2 text-sm sm:text-lg font-bold text-slate-800">
          <span>I have no account?</span>
          <Link href="/register" className="font-black text-amber-700 hover:text-rose-600 hover:underline">
            Sign Up
          </Link>
        </div>

      </CardContent>
    </Card>
  );
}