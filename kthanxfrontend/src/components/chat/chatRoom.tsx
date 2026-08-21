"use client";

import React, { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Lock, Sparkles } from "lucide-react";

import { ChatHeader } from "./ChatHeader";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { useSocket } from "@/context/SocketContext";

interface Message {
  id: number | string;
  sender: "user" | "stranger";
  text: string;
  time: string;
}

interface AnonymousChatRoomProps {
  roomId?: string;
}

export default function AnonymousChatRoom({ roomId: propRoomId }: AnonymousChatRoomProps) {
  const router = useRouter();
  const params = useParams();

  const roomId = propRoomId || (params?.roomId as string);
  const { socket } = useSocket();

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!socket || !roomId) return;

    // 🚀 রুমে জয়েন ফায়ার করার সেফ মেথড
    const joinRoom = () => {
      console.log(`📌 Emitting join-room for room: ${roomId} with socket: ${socket.id}`);
      socket.emit("join-room", { roomId });
    };

    if (socket.connected) {
      joinRoom();
    }
    
    // সকেট রি-কানেক্ট হলেও অটো রুম জয়েন করবে
    socket.on("connect", joinRoom);

    const handleReceiveMessage = (data: {
      senderId: string;
      message: string;
      createAt?: string;
      createdAt?: string;
    }) => {
      console.log("📩 Message Received:", data);
      const rawDate = data.createAt || data.createdAt || new Date().toISOString();
      const formattedTime = new Date(rawDate).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          sender: "stranger",
          text: data.message,
          time: formattedTime,
        },
      ]);
    };

    const handleUserTyping = ({ isTyping }: { isTyping: boolean }) => {
      setIsTyping(isTyping);
    };

    const handlePartnerLeft = () => {
      alert("Your partner has left the chat room.");
      router.push("/dashboard");
    };

    socket.on("receive-message", handleReceiveMessage);
    socket.on("user-typing", handleUserTyping);
    socket.on("partner-left", handlePartnerLeft);

    return () => {
      socket.off("connect", joinRoom);
      socket.off("receive-message", handleReceiveMessage);
      socket.off("user-typing", handleUserTyping);
      socket.off("partner-left", handlePartnerLeft);
    };
  }, [socket, roomId, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || !socket || !roomId) return;

    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const textToSend = inputMessage.trim();

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: "user",
        text: textToSend,
        time: currentTime,
      },
    ]);

    socket.emit("send-message", {
      roomId,
      message: textToSend,
      messages: textToSend,
    });

    setInputMessage("");
  };

  const handleTyping = () => {
    if (socket && roomId) socket.emit("typing", { roomId });
  };

  const handleStopTyping = () => {
    if (socket && roomId) socket.emit("stop-typing", { roomId });
  };

  const handleExit = () => {
    if (socket && roomId) socket.emit("leave-room");
    router.push("/dashboard");
  };

  const handleDeleteMessage = (id: number | string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  };

  return (
    <div className="w-[95%] max-w-5xl mx-auto h-full flex flex-col justify-between py-3 select-none overflow-hidden">
      <div className="shrink-0 w-full">
        <ChatHeader onExit={handleExit} />
      </div>

      <div className="w-fit mx-auto my-1.5 py-0.5 px-3 bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-white/10 backdrop-blur-md rounded-full flex items-center gap-1 text-[10px] font-extrabold text-slate-800 dark:text-slate-200 shadow-sm shrink-0">
        <Lock className="w-3 h-3 text-rose-500" />
        <span>End-to-End Encrypted Anonymous Chat</span>
      </div>

      <div className="w-full flex-1 overflow-y-auto px-1 py-2 space-y-3 scrollbar-none">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              msg={msg}
              onDelete={handleDeleteMessage}
            />
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="flex items-center gap-1.5 text-slate-900 dark:text-slate-100 text-xs font-black italic bg-white/50 dark:bg-slate-800/50 w-fit px-3 py-1 rounded-xl border border-white/40 backdrop-blur-md shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-500 animate-spin" />
            <span>Stranger is typing...</span>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="shrink-0 w-full pt-1">
        <ChatInput
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          onSend={handleSendMessage}
          onTyping={handleTyping}
          onStopTyping={handleStopTyping}
        />
      </div>
    </div>
  );
}