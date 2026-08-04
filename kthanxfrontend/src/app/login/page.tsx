import AnimatedBackground from "@/components/AnimatedBackground";
import AuthLogin from "@/components/auth/authLogin";

export default function page() {
  return (
    <div className="relative w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-300 via-purple-100 to-indigo-200 p-4 sm:p-6 font-sans overflow-hidden">
      <div className="relative z-10 w-full max-w-2xl flex justify-center">
        <AnimatedBackground />
        <AuthLogin />
      </div>
    </div>
  );
}
