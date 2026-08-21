"use client";

import { use } from "react";
import AnimatedBackground from "@/components/AnimatedBackground";
import AnonymousChatRoom from "@/components/chat/chatRoom";

interface ChatPageProps {
  params: Promise<{
    roomId: string;
  }>;
}

export default function ChatPage({ params }: ChatPageProps) {
  const resolvedParams = use(params);
  const roomId = resolvedParams.roomId;

  return (
    <main className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-rose-300 via-purple-100 to-indigo-200 flex items-center justify-center font-sans">
      <AnimatedBackground />

      <div className="relative z-10 w-full h-full flex items-center justify-center">
        {/* প্রপস হিসেবে roomId পাস করা হলো */}
        <AnonymousChatRoom roomId={roomId} />
      </div>
    </main>
  );
}