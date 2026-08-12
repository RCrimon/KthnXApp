"use client";

import React, { useRef } from "react";
import { Smile, Paperclip, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  inputMessage: string;
  setInputMessage: (val: string) => void;
  onSend: (e?: React.FormEvent) => void;
  onTyping?: ()=> void;
  onStopTyping?: ()=> void;
}

export function ChatInput({ inputMessage, setInputMessage, onSend , onTyping, onStopTyping }: ChatInputProps) {
  const typingTimeOutRef = useRef<NodeJS.Timeout | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
    setInputMessage(e.target.value)
    if(onTyping) onTyping()
    if(typingTimeOutRef.current) clearTimeout(typingTimeOutRef.current)
      typingTimeOutRef.current = setTimeout(()=>{
    if(onStopTyping) onStopTyping()
    }, 1500)
  }

  const handleSubmit = (e: React.FormEvent)=>{
    e.preventDefault()
    if(typingTimeOutRef.current) clearTimeout(typingTimeOutRef.current)
    if(onStopTyping) onStopTyping()
      onSend(e)
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="w-full p-2 border border-white/40 dark:border-white/10 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-lg rounded-2xl flex items-center gap-1.5"
    >
      <button
        type="button"
        className="p-1.5 hover:bg-black/5 rounded-xl transition-all cursor-pointer"
        title="Emoji"
      >
        <Smile className="w-5 h-5 text-amber-600" />
      </button>
      <button
        type="button"
        className="p-1.5 hover:bg-black/5 rounded-xl transition-all cursor-pointer"
        title="Attach File"
      >
        <Paperclip className="w-5 h-5 text-slate-700 dark:text-slate-300" />
      </button>

      <input
        type="text"
        value={inputMessage}
        onChange={handleInputChange}
        placeholder="Type an anonymous message..."
        className="flex-1 bg-white/70 dark:bg-slate-800/70 text-slate-900 dark:text-white placeholder-slate-600 text-xs sm:text-sm font-extrabold px-3 py-2 rounded-xl border border-black/5 focus:outline-none"
      />

      <Button
        type="submit"
        className="bg-gradient-to-r from-amber-500 via-rose-500 to-amber-600 text-white font-black text-xs sm:text-sm px-3.5 py-2 rounded-xl shadow-md flex items-center gap-1 cursor-pointer h-9"
      >
        <span>Send</span>
        <Send className="w-3.5 h-3.5" />
      </Button>
    </form>
  );
}