"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoreHorizontal, Trash2 } from "lucide-react";

interface MessageBubbleProps {
  msg: {
    id: number | string;
    sender: "user" | "stranger";
    text: string;
    time: string;
  };
  onDelete?: (id: number | string) => void;
}

export function MessageBubble({ msg, onDelete }: MessageBubbleProps) {
  const isUser = msg.sender === "user";
  const [showOptions, setShowOptions] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className={`group flex flex-col ${isUser ? "items-end" : "items-start"} relative my-1`}
    >
      <div className={`flex items-center gap-1.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        
        <div
          className={`relative max-w-[80%] sm:max-w-[70%] px-4 py-2.5 rounded-2xl backdrop-blur-2xl border border-white/80 dark:border-white/20 transition-all duration-300 shadow-xl shadow-indigo-950/10 hover:shadow-2xl ${
            isUser ? "rounded-tr-none" : "rounded-tl-none"
          } bg-gradient-to-br from-white/85 via-purple-50/70 to-rose-50/80 dark:from-slate-900/80 dark:via-purple-950/50 dark:to-slate-900/80`}
        >
      
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />

          <p className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-100 leading-relaxed tracking-wide break-words relative z-10">
            {msg.text}
          </p>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowOptions((prev) => !prev)}
            className="p-1 rounded-full text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800/50 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all cursor-pointer"
            title="More Options"
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>

          <AnimatePresence>
            {showOptions && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 5 }}
                className={`absolute z-30 bottom-full mb-1 ${
                  isUser ? "right-0" : "left-0"
                } bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-2xl rounded-xl p-1 min-w-[95px]`}
              >
                <button
                  onClick={() => {
                    setShowOptions(false);
                    if (onDelete) onDelete(msg.id);
                  }}
                  className="flex items-center gap-1.5 w-full text-left px-2.5 py-1.5 text-[11px] font-extrabold text-rose-600 hover:bg-rose-500/10 rounded-lg transition-all cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Delete</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

  
      <span className="text-[9px] font-black text-slate-600 dark:text-slate-400 opacity-75 px-1 mt-1 tracking-wider">
        {msg.time}
      </span>
    </motion.div>
  );
}