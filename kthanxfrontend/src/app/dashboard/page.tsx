import React from "react";
import AnimatedBackground from "@/components/AnimatedBackground";
import Navbar from "@/components/dashboard/Navbar";
import UserProfile from "@/components/dashboard/UserProfile";
import MatchSection from "@/components/dashboard/MatchSection";
import ActionCards from "@/components/dashboard/ActionCards";

export default function DashboardPage() {
  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-rose-300 via-purple-100 to-indigo-200 p-2 sm:p-4 font-sans overflow-hidden flex items-center justify-center">
      <AnimatedBackground />

      <div className="relative z-10 w-full max-w-[1300px] h-full mx-auto p-2 sm:p-4 flex flex-col justify-between gap-3 sm:gap-3">
        <Navbar />

        <main className="w-full flex-1 flex flex-col justify-between gap-2 sm:gap-3 my-auto overflow-hidden">
          <UserProfile />
          <MatchSection />
          <ActionCards />
        </main>
      </div>
    </div>
  );
}