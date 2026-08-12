"use client";

import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserProfile } from "@/services/auth.service";

// 🎯 ১. ইন্টারফেস কম্পোনেন্টের বাইরে নিয়ে আসা হলো
interface IUser {
  _id?: string;
  name?: string;
  email?: string;
  avatar?: string;
}

export default function UserProfile() {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        console.log("Fetched User Profile Data:", data); // 🔍 ব্রাউজার কনসোলে রেসপন্স স্ট্রাকচার দেখার জন্য

        // 🎯 ২. ব্যাকএন্ডের বিভিন্ন রেসপন্স ফরম্যাটের জন্য সেফ এক্সট্রাকশন
        const userObj = data?.user || data?.data?.user || data?.data || data;
        setUser(userObj);
      } catch (error) {
        const err = error as any;
        console.error("Profile load failed detailed error:", {
          message: err?.message,
          response: err?.response?.data,
          status: err?.response?.status,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // 🎯 ৩. ফার্স্ট নেম বা পুরো নাম সঠিকভাবে হ্যান্ডেল করা
  const getDisplayName = (fullName?: string) => {
    if (!fullName || fullName.trim() === "") return "User";
    const parts = fullName.trim().split(/\s+/);
    // যদি ২ বা তার বেশি শব্দ থাকে তবে ২য় নাম, নাহলে ১ম নাম
    return parts.length > 1 ? parts[1] : parts[0];
  };

  const getInitials = (name?: string) => {
    if (!name || name.trim() === "") return "U";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="w-full flex-1 max-h-[100px] sm:max-h-[120px] transition-all duration-300 flex items-center">
      <div className="w-full h-full opacity-95 bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl border-2 border-white/70 dark:border-white/10 rounded-2xl sm:rounded-3xl px-3 sm:px-6 py-2 sm:py-3 flex flex-row items-center justify-between gap-2 shadow-sm">
        
        {loading ? (
          <div className="flex items-center gap-3 animate-pulse">
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-slate-300 dark:bg-slate-700" />
            <div className="flex flex-col gap-2">
              <div className="w-32 h-4 sm:h-6 bg-slate-300 dark:bg-slate-700 rounded-md" />
              <div className="w-24 h-3 bg-slate-200 dark:bg-slate-800 rounded-md" />
            </div>
          </div>
        ) : (
          <div className="flex flex-row items-center gap-2.5 sm:gap-5 text-left">
            <Avatar className="w-10 h-10 sm:w-14 sm:h-14 border-2 border-white/80 dark:border-slate-700 shadow-md ring-2 ring-amber-400/40">
              <AvatarImage src={user?.avatar || ""} alt={user?.name || "User"} />
              <AvatarFallback className="bg-gradient-to-r from-amber-500 to-rose-500 text-white font-black text-sm sm:text-lg">
                {getInitials(user?.name)}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col items-start leading-tight">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <h1 className="text-base sm:text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                  <span className="bg-gradient-to-r from-amber-500 to-rose-500 bg-clip-text text-transparent">
                    {getDisplayName(user?.name)}!
                  </span>
                </h1>
              </div>

              <p className="text-[11px] sm:text-sm font-extrabold text-slate-700 dark:text-slate-300 mt-0.5">
                Ready to meet new people today?
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-1.5 sm:gap-2 bg-black/5 dark:bg-white/10 border border-black/5 dark:border-white/10 px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full shrink-0">
          <span className="relative flex h-2 sm:h-2.5 w-2 sm:w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 sm:h-2.5 w-2 sm:w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] sm:text-sm font-black tracking-tight text-slate-800 dark:text-white">
            Active Now
          </span>
        </div>

      </div>
    </div>
  );
}