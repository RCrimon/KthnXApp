"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSocket } from "@/context/SocketContext";
import AnimatedBackground from "@/components/AnimatedBackground";
import MatchingRadarCard from "@/components/matching/macthingCard";

// 🎯 ১. মূল Matching Logic Component
function MatchingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawPref = searchParams.get("pref") || "anyone";

  const preferenceMap: Record<string, "Male" | "Female" | "Both"> = {
    male: "Male",
    female: "Female",
    anyone: "Both",
    both: "Both",
  };
  
  const interestedIn = preferenceMap[rawPref.toLowerCase()] || "Both";
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleMatchFound = ({ roomId }: { roomId: string; partnerId?: string }) => {
      console.log("🎉 Match Found! Room ID:", roomId);
      router.push(`/chat/${roomId}`);
    };

    const handleMatchError = (errorMsg: string) => {
      console.error("⚠️ Matchmaking Error:", errorMsg);
      alert(errorMsg);
      router.push("/dashboard");
    };

    socket.on("match-found", handleMatchFound);
    socket.on("matched", handleMatchFound);
    socket.on("match-error", handleMatchError);

    return () => {
      // 🔴 এখানে রাউট চেঞ্জের সময় যেন ক্যানসেল কল না হয়, তাই এটি রিমুভ করা হয়েছে
      socket.off("match-found", handleMatchFound);
      socket.off("matched", handleMatchFound);
      socket.off("match-error", handleMatchError);
    };
  }, [socket, isConnected, router]);

  return (
    <div className="relative z-10 w-full max-w-2xl flex justify-center">
      <AnimatedBackground />
      <MatchingRadarCard preference={interestedIn} />
    </div>
  );
}

// 🎯 ২. Main Page Export
export default function MatchingPage() {
  return (
    <div className="relative w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-300 via-purple-100 to-indigo-200 p-4 sm:p-6 font-sans overflow-hidden">
      <Suspense
        fallback={
          <div className="relative z-10 text-xl font-bold text-slate-800 animate-pulse">
            Finding partner...
          </div>
        }
      >
        <MatchingContent />
      </Suspense>
    </div>
  );
}