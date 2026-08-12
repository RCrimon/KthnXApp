"use client";

import React, { useEffect, useState } from "react";
import { Settings, LogOut, Moon, Sun } from "lucide-react";
import {useRouter} from "next/navigation";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import Link from "next/link"

export default function Navbar() {
  const { theme, setTheme, resolvedTheme} = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter()

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogoout = ()=>{
    Cookies.remove("token")
    localStorage.removeItem("token")
    router.push("/login")
  }

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark" || theme === "dark"

  return (
    <nav className="w-full transition-all duration-300">
      <div className="w-full bg-white/40 opacity-95 dark:bg-slate-900/40 backdrop-blur-2xl border-2 border-white/70 dark:border-white/10 rounded-2xl sm:rounded-3xl px-3 sm:px-6 py-2 sm:py-3 flex items-center justify-between gap-2 shadow-sm">
        
        <Link href="/dashboard"><span className="text-xl sm:text-3xl font-black tracking-tight bg-gradient-to-r from-amber-500 via-rose-500 to-amber-400 bg-clip-text text-transparent">
          KthanX
        </span>
        </Link>

        
        <div className="flex items-center gap-1.5 sm:gap-2">
          
         <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="w-8 h-8 sm:w-9 sm:h-9 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 rounded-xl cursor-pointer transition-all active:scale-95 border border-black/5 dark:border-white/10"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </Button>

          <Link href="/settings">
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 sm:w-auto sm:h-9 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 font-extrabold rounded-xl text-xs sm:text-sm px-0 sm:px-3 border border-black/5 dark:border-white/10 text-slate-800 dark:text-white"
          >
            <Settings className="w-4 h-4 text-amber-500" />
            <span className="hidden md:inline">Settings</span>
          </Button></Link>

          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 sm:w-auto sm:h-9 bg-rose-500/15 hover:bg-rose-500/25 text-rose-600 dark:text-rose-400 font-black rounded-xl text-xs sm:text-sm px-0 sm:px-3 border border-rose-500/20"
            onClick={handleLogoout}
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Logout</span>
          </Button>
        </div>

      </div>
    </nav>
  );
}