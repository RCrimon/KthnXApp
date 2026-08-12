"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";
import { MatchedPartner } from "./macthingCard";

interface DummyAvatar {
  id: number;
  img: string;
}

interface RadarAvatarsProps {
  isMatched: boolean;
  isConnecting: boolean;
  userAvatar: string;
  displayName: string;
  currentIndex: number;
  dummyAvatars: DummyAvatar[];
  matchedPartner: MatchedPartner | null;
}

export function RadarAvatars({ 
  isMatched, 
  isConnecting, 
  userAvatar, 
  displayName, 
  currentIndex, 
  dummyAvatars, 
  matchedPartner 
}: RadarAvatarsProps) {
  return (
    <div className="flex items-center justify-center w-full px-4 min-h-[140px]">
      <AnimatePresence mode="wait">
        {!isMatched ? (
          <motion.div key="searching" exit={{ opacity: 0, scale: 0.8 }} className="flex items-center justify-center gap-4 sm:gap-12 w-full">
            
  
            <div className="flex flex-col items-center gap-2">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-r from-amber-500 to-rose-500 border-2 border-white/40">
                <div className="w-full h-full rounded-full bg-slate-900 border-2 border-white/80 flex items-center justify-center overflow-hidden">
                  <img src={userAvatar} alt={displayName} className="w-20 h-20 sm:w-24 sm:h-24 object-cover" />
                </div>
              </div>
              <span className="font-black text-xs sm:text-sm text-slate-800 dark:text-slate-200">{displayName}</span>
            </div>

     
            <div className="flex flex-col items-center gap-1">
              <motion.div animate={isConnecting ? { rotate: 360, scale: 1.2 } : { y: [-3, 3, -3] }}>
                <Zap className="w-7 h-7 sm:w-8 sm:h-8 text-amber-500 fill-amber-500" />
              </motion.div>
              <span className="font-black text-[10px] sm:text-xs text-slate-800 dark:text-slate-200 uppercase">
                {isConnecting ? "CONNECTING..." : "CONNECT WITH"}
              </span>
            </div>

         
            <div className="flex flex-col items-center gap-2">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-r from-amber-500 to-rose-500 border-2 border-white/40 overflow-hidden relative">
                <AnimatePresence mode="popLayout">
                  <motion.img
                    key={dummyAvatars[currentIndex].id}
                    src={dummyAvatars[currentIndex].img}
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -40, opacity: 0 }}
                    className="w-16 h-16 sm:w-22 sm:h-22 object-cover absolute inset-0 m-auto"
                  />
                </AnimatePresence>
              </div>
              <span className="font-black text-xs sm:text-sm text-slate-800 dark:text-slate-200">Searching Partner...</span>
            </div>
          </motion.div>
        ) : (
          
          <motion.div key="matched" className="flex flex-col items-center justify-center relative w-full">
            <div className="relative flex items-center justify-center">
              <div className="z-10 relative w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-amber-500 border-2 border-white shadow-xl">
                <img src={userAvatar} alt={displayName} className="w-full h-full rounded-full" />
              </div>
              <Zap className="z-30 absolute w-6 h-6 text-white fill-white bg-rose-500 p-1 rounded-full animate-bounce" />
              <div className="z-20 relative w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-rose-500 border-2 border-white shadow-xl">
                <img src={matchedPartner?.avatar || "https://api.dicebear.com/7.x/bottts/svg?seed=Partner"} alt="Partner" className="w-full h-full rounded-full" />
              </div>
            </div>
            <span className="font-black text-sm sm:text-base mt-4 bg-gradient-to-r from-amber-500 to-rose-500 bg-clip-text text-transparent">
              {displayName} & {matchedPartner?.name || "Partner"}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}