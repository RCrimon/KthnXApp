"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

let globalSocket: Socket | null = null;

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(globalSocket);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!globalSocket) {
     const BACKEND_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

    globalSocket = io(BACKEND_URL, {
        withCredentials: true,
        transports: ["websocket", "polling"],
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
   
        auth: {
          token: typeof window !== "undefined" ? localStorage.getItem("token") : "",
        },
      });
    }

    const s = globalSocket;
    setSocket(s);

    function onConnect() {
      console.log("Socket Connected! ID:", s.id);
      setIsConnected(true);
    }

    function onDisconnect(reason: string) {
      console.log("Socket Disconnected Reason:", reason);
      setIsConnected(false);
    }

    s.on("connect", onConnect);
    s.on("disconnect", onDisconnect);

    if (s.connected) {
      setIsConnected(true);
    }

    return () => {
      s.off("connect", onConnect);
      s.off("disconnect", onDisconnect);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);