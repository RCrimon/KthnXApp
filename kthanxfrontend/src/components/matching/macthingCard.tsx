"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Sparkles, Filter, Play, CheckCircle2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSocket } from "@/context/SocketContext";
import { RadarAvatars } from "./RadarAvatars";

const DUMMY_AVATARS = [
  { id: 1, img: "https://api.dicebear.com/7.x/bottts/svg?seed=Alex" },
  { id: 2, img: "https://api.dicebear.com/7.x/bottts/svg?seed=Sarah" },
  { id: 3, img: "https://api.dicebear.com/7.x/bottts/svg?seed=David" },
  { id: 4, img: "https://api.dicebear.com/7.x/bottts/svg?seed=Emma" },
];

export interface MatchedPartner {
  id: string;
  name: string;
  avatar?: string;
}

export interface MatchFoundData {
  partnerId?: string;
  roomId: string;
}

interface MatchingRadarCardProps {
  preference?: string;
  userName?: string;
  userAvatar?: string;
}

export default function MatchingRadarCard({ 
  preference = "Anyone", 
  userName = "You",
  userAvatar = "https://api.dicebear.com/7.x/bottts/svg?seed=Rimon" 
}: MatchingRadarCardProps) {
  const router = useRouter();
  const { socket, isConnected } = useSocket();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMatched, setIsMatched] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [matchedPartner, setMatchedPartner] = useState<MatchedPartner | null>(null);

  useEffect(() => {
    if (isMatched || isConnecting) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % DUMMY_AVATARS.length);
    }, 800);
    return () => clearInterval(interval);
  }, [isMatched, isConnecting]);


  useEffect(() => {
    if (!socket) return;

    let timeoutId: NodeJS.Timeout;

    const handleMatchFound = (data: MatchFoundData) => {
      setMatchedPartner({ id: data.partnerId || "partner", name: "Stranger" });
      setIsConnecting(false);
      setIsMatched(true);
      
      timeoutId = setTimeout(() => {
        router.push(`/chat/${data.roomId}`);
      }, 1500);
    };

    const handleWaiting = (msg: string) => {
      console.log("Waiting:", msg);
    };

    socket.on("match-found", handleMatchFound);
    socket.on("matched", handleMatchFound);
    socket.on("waiting-for-match", handleWaiting);

    return () => {
      socket.off("match-found", handleMatchFound);
      socket.off("matched", handleMatchFound);
      socket.off("waiting-for-match", handleWaiting);
      if (timeoutId) clearTimeout(timeoutId); 
    };
  }, [socket, router]);

  const handleManualMatch = () => {
    if (!socket || !isConnected) return alert("Socket disconnected!");
    setIsConnecting(true);
    
    console.log("📡 Emitting join-matchmaking with preference:", preference);
    socket.emit("join-matchmaking", { interestedIn: preference });
  };

  return (
    <div className="w-full max-w-3xl opacity-95 bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl border-2 border-white/70 dark:border-white/10 shadow-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-col gap-5">
      <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
        <span className="font-black text-xl sm:text-2xl bg-gradient-to-r from-amber-500 to-rose-500 bg-clip-text text-transparent">
          KthanX
        </span>
        <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")} className="rounded-xl">
          <X className="w-4 h-4 mr-1" /> Cancel
        </Button>
      </div>

      <div className="flex flex-col items-center gap-6 py-8 bg-black/5 dark:bg-white/5 rounded-2xl min-h-[280px]">
        <h2 className="font-black text-base sm:text-lg text-slate-900 dark:text-white uppercase">
          {isMatched ? "Perfect Match Found!" : "Matching Radar"}
        </h2>

        <RadarAvatars 
          isMatched={isMatched}
          isConnecting={isConnecting}
          userAvatar={userAvatar}
          displayName={userName}
          currentIndex={currentIndex}
          dummyAvatars={DUMMY_AVATARS}
          matchedPartner={matchedPartner}
        />

        <div className="flex items-center gap-1.5 bg-black/5 dark:bg-white/10 px-3.5 py-1.5 rounded-xl text-xs font-black">
          <Filter className="w-3.5 h-3.5 text-amber-500" />
          <span>Filter: <strong className="text-rose-500 capitalize">{preference}</strong></span>
        </div>

        <div className="w-full max-w-xs px-4">
          {!isMatched ? (
            <Button 
              onClick={handleManualMatch} 
              disabled={isConnecting} 
              className="w-full h-12 bg-gradient-to-r from-amber-500 to-rose-500 font-black rounded-xl hover:opacity-90 transition-opacity"
            >
              {isConnecting ? <Zap className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-white" />}
              <span>{isConnecting ? "SEARCHING..." : "MATCH NOW"}</span>
            </Button>
          ) : (
            <div className="flex items-center justify-center gap-2 text-emerald-500 font-black text-sm bg-emerald-500/10 py-3 rounded-xl border border-emerald-500/30">
              <CheckCircle2 className="w-5 h-5" /> Redirecting to Chat...
            </div>
          )}
        </div>
      </div>

      <div className="text-center font-extrabold text-xs text-slate-500 flex items-center justify-center gap-1.5">
        Tip: Keep tab open to connect fastest
      </div>
    </div>
  );
}