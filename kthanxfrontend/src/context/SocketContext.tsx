"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";
import Cookies from "js-cookie";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({ 
  socket: null,
  isConnected: false
});

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
   
    const activeToken = token || Cookies.get("token") || (typeof window !== "undefined" ? localStorage.getItem("token") : null);

    if (!activeToken) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000", {
      auth: { token: activeToken },
      transports: ["websocket", "polling"], 
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
    });

    socketInstance.on("connect", () => {
      console.log("🟢 Socket Connected! ID:", socketInstance.id);
      setIsConnected(true);
    });
    
    socketInstance.on("connect_error", (err) => {
      console.error("🔴 Socket Connect Error:", err.message);
      setIsConnected(false);
    });

    socketInstance.on("disconnect", (reason) => {
      console.log("🟡 Socket Disconnected Reason:", reason);
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [token]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);