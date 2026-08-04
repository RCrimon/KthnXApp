"use client";

import { motion } from "framer-motion";
import { 
  Star,
  Heart, 
  CircleDot,
  Triangle,
  Square,        
  MessageCircle, 
  VenetianMask,    
  Video,        
  Mic,
  Lock,
  UserX, 
} from 'lucide-react';

const floatingIcons = [ { Icon: Star, top: "3%", left: "48%", size: "w-6 h-6 sm:w-8 sm:h-8", color: "text-amber-400 fill-amber-300 opacity-90 drop-shadow-[0_0_20px_rgba(251,191,36,0.95)]", stroke: 1.5 }, 

  { Icon: VenetianMask, top: "12%", left: "6%", size: "w-7 h-7 sm:w-10 sm:h-10", color: "text-purple-600 stroke-slate-950 opacity-90", stroke: 2.2 },
  { Icon: Star, top: "24%", left: "16%", size: "w-6 h-6 sm:w-8 sm:h-8", color: "text-amber-500 opacity-80", stroke: 1.8 },
  { Icon: MessageCircle, top: "38%", left: "4%", size: "w-7 h-7 sm:w-9 sm:h-9", color: "text-sky-500 stroke-gray-900 opacity-85", stroke: 2.5 },
  { Icon: Heart, top: "52%", left: "12%", size: "w-7 h-7 sm:w-10 sm:h-10", color: "text-rose-500 fill-rose-500 opacity-90 drop-shadow-[0_0_20px_rgba(244,63,94,0.9)]", stroke: 1.2 }, 
  { Icon: Triangle, top: "66%", left: "6%", size: "w-6 h-6 sm:w-8 sm:h-8", color: "text-emerald-600 stroke-slate-900 opacity-80", stroke: 2.5 },

  { Icon: Video, top: "16%", left: "30%", size: "w-5 h-5 sm:w-7 sm:h-7", color: "text-blue-600 stroke-black opacity-80", stroke: 2.5 },
  { Icon: CircleDot, top: "32%", left: "26%", size: "w-6 h-6 sm:w-8 sm:h-8", color: "text-cyan-400 opacity-90 drop-shadow-[0_0_18px_rgba(34,211,238,0.9)]", stroke: 2 }, 
  { Icon: Square, top: "46%", left: "28%", size: "w-5 h-5 sm:w-7 sm:h-7", color: "text-violet-500 stroke-slate-900 opacity-75", stroke: 2.2 },

  { Icon: VenetianMask, top: "12%", right: "6%", size: "w-7 h-7 sm:w-11 sm:h-11", color: "text-purple-400 opacity-90 drop-shadow-[0_0_22px_rgba(192,132,252,0.95)]", stroke: 1.5 },
  { Icon: Video, top: "26%", right: "14%", size: "w-6 h-6 sm:w-9 sm:h-9", color: "text-indigo-600 stroke-slate-950 opacity-85", stroke: 2.5 },
  { Icon: Square, top: "72%", right: "6%", size: "w-6 h-6 sm:w-8 sm:h-8", color: "text-blue-600 stroke-gray-900 opacity-80", stroke: 2.5 },
  { Icon: UserX, top: "86%", right: "15%", size: "w-6 h-6 sm:w-9 sm:h-9", color: "text-pink-500 opacity-75", stroke: 1.8 }, 

  { Icon: Triangle, top: "18%", right: "26%", size: "w-5 h-5 sm:w-7 sm:h-7", color: "text-emerald-500 stroke-slate-900 opacity-80", stroke: 2.5 },
  { Icon: Lock, top: "48%", right: "28%", size: "w-6 h-6 sm:w-8 sm:h-8", color: "text-yellow-400 opacity-90 drop-shadow-[0_0_20px_rgba(250,204,21,0.95)]", stroke: 1.8 }, 
  { Icon: Star, top: "80%", right: "30%", size: "w-6 h-6 sm:w-8 sm:h-8", color: "text-amber-500 opacity-80", stroke: 1.8 },

  { Icon: Heart, bottom: "3%", left: "5%", size: "w-6 h-6 sm:w-8 sm:h-8", color: "text-rose-500 opacity-75 stroke-slate-900", stroke: 2.2 },
  { Icon: MessageCircle, bottom: "2%", left: "26%", size: "w-6 h-6 sm:w-8 sm:h-8", color: "text-sky-400 opacity-90 drop-shadow-[0_0_18px_rgba(56,189,248,0.9)]", stroke: 1.8 }, 
  { Icon: Video, bottom: "3%", right: "4%", size: "w-6 h-6 sm:w-8 sm:h-8", color: "text-indigo-500 opacity-75 stroke-slate-900", stroke: 2.2 },

];

const animationVariants = [
  {
    y: [0, -10, 0],
    rotate: [0, 6, -6, 0],
  },
  {
    x: [0, 8, -8, 0],
    y: [0, -6, 6, 0],
  },
  {
    scale: [0.95, 1.08, 0.95],
    rotate: [0, 8, 0],
  },
  {
    x: [-6, 6, -6],
    rotate: [-8, 8, -8],
  }
];

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div 
        className="absolute top-[42%] left-1/2 -translate-x-1/2 
                   w-[120vmax] h-[120vmax] min-w-[700px] min-h-[700px]
                   rounded-full 
                   border-2 border-amber-400/90
                   bg-gradient-to-t from-amber-500/15 via-amber-500/5 to-transparent
                   drop-shadow-[0_0_35px_rgba(245,158,11,0.7)]
                   shadow-[0_0_50px_rgba(245,158,11,0.4)]"
      />

      {floatingIcons.map((item, index) => {
        const { Icon, top, bottom, left, right, size, color, stroke } = item;
        const selectedAnimation = animationVariants[index % animationVariants.length];

        return (
          <motion.div
            key={index}
            animate={selectedAnimation}
            transition={{
              duration: 6 + (index % 4) * 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: (index % 5) * 0.5
            }}
            className="absolute"
            style={{ left, right, bottom, top }}
          >
            <Icon className={`${color} ${size}`} strokeWidth={stroke} />
          </motion.div>
        );
      })} 
    </div>
  );
}