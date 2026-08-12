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

  // 🎯 ব্যাকএন্ড ফরম্যাটের সাথে মিল রাখা ('Male' | 'Female' | 'Both')
  const preferenceMap: Record<string, "Male" | "Female" | "Both"> = {
    male: "Male",
    female: "Female",
    anyone: "Both",
  };
  const interestedIn = preferenceMap[rawPref.toLowerCase()] || "Both";

  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!socket || !isConnected) return;

    console.log("📡 Joining matchmaking queue...");

    // 🎯১. সঠিক ইভেন্ট নেম 'join-matchmaking' ফায়ার করা হলো
    socket.emit("join-matchmaking", { interestedIn });

    // 🎯২. ইভেন্ট লিসেনার
    const handleMatchFound = ({ roomId, partnerId }: { roomId: string; partnerId: string }) => {
      console.log("🎉 Match Found! Room ID:", roomId);
      router.push(`/chat/${roomId}`);
    };

    const handleMatchError = (errorMsg: string) => {
      console.error("⚠️ Matchmaking Error:", errorMsg);
      alert(errorMsg);
      router.push("/dashboard");
    };

    socket.on("match-found", handleMatchFound);
    socket.on("match-error", handleMatchError);

    return () => {
      socket.off("match-found", handleMatchFound);
      socket.off("match-error", handleMatchError);
    };
  }, [socket, isConnected, interestedIn, router]);

  return (
    <div className="relative z-10 w-full max-w-2xl flex justify-center">
      <AnimatedBackground />
      <MatchingRadarCard />
    </div>
  );
}

// 🎯 ২. Suspense Boundary সহ Main Page Export
export default function MatchingPage() {
  return (
    <div className="relative w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-300 via-purple-100 to-indigo-200 p-4 sm:p-6 font-sans overflow-hidden">
      <Suspense fallback={
        <div className="relative z-10 text-xl font-bold text-slate-800 animate-pulse">
          Finding partner...
        </div>
      }>
        <MatchingContent />
      </Suspense>
    </div>
  );
}