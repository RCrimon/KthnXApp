"use client";

import React from "react";
import { UserPlus, Phone, Video, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatHeaderProps {
  onAddFriend?: () => void;
  onAudioCall?: () => void;
  onVideoCall?: () => void;
  onExit?: () => void;
}

export function ChatHeader({
  onAddFriend,
  onAudioCall,
  onVideoCall,
  onExit,
}: ChatHeaderProps) {
  return (
    <div className="w-full flex items-center justify-between px-3 sm:px-5 py-2 border border-white/40 dark:border-white/10 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-md rounded-2xl">
      
      
      <div className="flex items-center gap-2">
        <span className="font-black text-xl bg-gradient-to-r from-amber-500 via-rose-500 to-amber-600 bg-clip-text text-transparent tracking-wider">
          KthanX
        </span>
        <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Online
        </div>
      </div>

     
      <div className="flex items-center gap-1.5 sm:gap-2">
        <Button
          onClick={onAddFriend}
          size="sm"
          variant="outline"
          className="flex items-center gap-1.5 text-xs font-extrabold rounded-xl bg-black/5 dark:bg-white/10 border-black/5 dark:border-white/10 hover:bg-rose-500 hover:text-white transition-all cursor-pointer h-8 px-2.5"
        >
          <UserPlus className="w-3.5 h-3.5 text-amber-500" />
          <span className="hidden sm:inline">Add Friend</span>
        </Button>

        <div className="flex items-center gap-0.5 bg-black/5 dark:bg-white/10 p-0.5 rounded-xl border border-black/5 dark:border-white/10">
          <button
            onClick={onAudioCall}
            type="button"
            className="p-1.5 hover:bg-amber-500 hover:text-white rounded-lg transition-all text-slate-700 dark:text-slate-200 cursor-pointer"
            title="Audio Call"
          >
            <Phone className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onVideoCall}
            type="button"
            className="p-1.5 hover:bg-rose-500 hover:text-white rounded-lg transition-all text-slate-700 dark:text-slate-200 cursor-pointer"
            title="Video Call"
          >
            <Video className="w-3.5 h-3.5" />
          </button>
        </div>

     
        <Button
          onClick={onExit}
          size="sm"
          className="flex items-center gap-1 text-xs font-extrabold rounded-xl bg-rose-500/20 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-500/30 transition-all cursor-pointer h-8 px-2.5"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Exit</span>
        </Button>
      </div>

    </div>
  );
}