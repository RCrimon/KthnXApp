"use client";


import { Users, User, UserCheck, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react"


export default function MatchSection() {
  const router = useRouter()
  const [preference, setPreference] = useState<"anyone" | "male" | "female">("anyone");
  const handleFindMacth = ()=>{
    router.push(`/matching?pref=${preference}`)
  }

  return (
    <div className="w-full flex-[4] min-h-0 transition-all duration-300 flex items-center">
      <div className="w-full h-full opacity-95 bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl border-2 border-white/70 dark:border-white/10 shadow-sm rounded-2xl sm:rounded-3xl p-3 sm:p-5 flex flex-col items-center justify-center gap-4 sm:gap-5 text-center overflow-hidden">
        
        <div className="w-full max-w-md sm:max-w-xl flex flex-col items-center gap-2 sm:gap-2.5">
          
          
        <div className="w-full max-w-md  sm:max-w-xl">
          <Button
            onClick={handleFindMacth}
            size="lg"
            className="w-full h-14 sm:h-16 bg-gradient-to-r from-amber-500 via-rose-500 to-amber-600 text-white font-black text-lg sm:text-2xl rounded-xl sm:rounded-2xl shadow-sm border-2 border-white/40 hover:border-white/70 hover:brightness-110 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.97] flex items-center justify-center gap-2 cursor-pointer tracking-wider"
          >
            <span className="drop-shadow-sm">FIND MATCH</span>
          </Button>
        </div>

          <p className="text-slate-800 dark:text-slate-200 font-extrabold text-[11px] sm:text-sm tracking-wide flex items-center gap-1">
            (Click to connect with strangers instantly)
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 w-full mt-1">
          <span className="font-black text-slate-800 dark:text-slate-200 text-[11px] sm:text-sm uppercase tracking-wider">
            Preferences:
          </span>

          <div className="flex items-center gap-1 bg-black/5 dark:bg-white/10 p-1 sm:p-1.5 rounded-xl sm:rounded-2xl border border-black/5 dark:border-white/10">
            <button
              type="button"
              onClick={() => setPreference("anyone")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl font-black text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
                preference === "anyone"
                  ? "bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-sm scale-105"
                  : "text-slate-800 dark:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10"
              }`}
            >
              <Users className="w-4 h-4" />
              Anyone
            </button>

            <button
              type="button"
              onClick={() => setPreference("male")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl font-black text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
                preference === "male"
                  ? "bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-sm scale-105"
                  : "text-slate-800 dark:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10"
              }`}
            >
              <User className="w-4 h-4" />
              Male
            </button>

            <button
              type="button"
              onClick={() => setPreference("female")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl font-black text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
                preference === "female"
                  ? "bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-sm scale-105"
                  : "text-slate-800 dark:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10"
              }`}
            >
              <UserCheck className="w-4 h-4" />
              Female
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}