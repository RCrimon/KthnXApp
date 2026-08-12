import AnimatedBackground from "@/components/AnimatedBackground";
import AnonymousChatRoom from "@/components/chat/chatRoom";

export default function ChatPage() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-rose-300 via-purple-100 to-indigo-200 flex items-center justify-center font-sans">
      
      {/* Background Effect */}
      <AnimatedBackground />

      {/* Anonymous Chat Container */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        <AnonymousChatRoom />
      </div>

    </main>
  );
}