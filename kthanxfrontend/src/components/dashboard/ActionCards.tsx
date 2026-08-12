"use client";

import React from "react";
import { UserCog, Users, ChevronRight, Edit3, UserCheck } from "lucide-react";

export default function ActionCards() {
  return (
   
    <div className="w-full flex-[3] min-h-0 transition-all duration-300 flex items-center">
      <div className="grid grid-cols-2 gap-2 sm:gap-4 w-full h-full">
        
       
        <div className="group relative opacity-95 w-full h-full bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl border-2 border-white/70 dark:border-white/10 shadow-sm rounded-2xl sm:rounded-3xl p-2 sm:p-3 flex items-center justify-between gap-2 cursor-pointer hover:bg-white/65 dark:hover:bg-slate-800/60 hover:border-amber-400/50 transition-all duration-300">
          
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left overflow-hidden w-full">
            <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-gradient-to-tr from-amber-400 to-rose-400 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform duration-300">
              <UserCog className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>

            <div className="flex flex-col items-center sm:items-start overflow-hidden w-full leading-tight">
              <div className="flex items-center gap-1 max-w-full">
                <h3 className="text-xs sm:text-sm md:text-base font-black text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors truncate">
                  Edit Profile
                </h3>
                <Edit3 className="w-3.5 h-3.5 text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity hidden md:inline shrink-0" />
              </div>
              <p className="text-[10px] sm:text-xs font-bold text-slate-600 dark:text-slate-300 mt-0.5 truncate max-w-full">
                Change Avatar & Bio
              </p>
            </div>
          </div>

          <div className="w-7 h-7 shrink-0 rounded-full bg-white/70 dark:bg-slate-800 border border-white/90 dark:border-white/10 items-center justify-center text-slate-700 dark:text-slate-200 group-hover:bg-amber-500 group-hover:text-white group-hover:border-transparent transition-all shadow-sm hidden md:flex">
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

     
        <div className="group opacity-95 relative w-full h-full bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl border-2 border-white/70 dark:border-white/10 shadow-sm rounded-2xl sm:rounded-3xl p-2 sm:p-3 flex items-center justify-between gap-2 cursor-pointer hover:bg-white/65 dark:hover:bg-slate-800/60 hover:border-rose-400/50 transition-all duration-300">
          
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left overflow-hidden w-full">
            <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-gradient-to-tr from-rose-400 to-purple-500 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform duration-300">
              <Users className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>

            <div className="flex flex-col items-center sm:items-start overflow-hidden w-full leading-tight">
              <div className="flex items-center gap-1 max-w-full">
                <h3 className="text-xs sm:text-sm md:text-base font-black text-slate-900 dark:text-white group-hover:text-rose-600 transition-colors truncate">
                  Friends List
                </h3>
                <UserCheck className="w-3.5 h-3.5 text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity hidden md:inline shrink-0" />
              </div>
              <p className="text-[10px] sm:text-xs font-bold text-slate-600 dark:text-slate-300 mt-0.5 truncate max-w-full">
                View Saved Friends
              </p>
            </div>
          </div>

          <div className="w-7 h-7 shrink-0 rounded-full bg-white/70 dark:bg-slate-800 border border-white/90 dark:border-white/10 items-center justify-center text-slate-700 dark:text-slate-200 group-hover:bg-rose-500 group-hover:text-white group-hover:border-transparent transition-all shadow-sm hidden md:flex">
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

      </div>
    </div>
  );
}