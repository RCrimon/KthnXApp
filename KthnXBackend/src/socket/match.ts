import type { Server, Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";

interface UserInt {
  id: string;
  name: string;
  email: string;
  gender: "Male" | "Female";
  interestedIn: "Male" | "Female" | "Both";
}

interface WaitingList {
  socketId: string;
  userId: string;
  interestedIn: "Male" | "Female" | "Both";
  gender: "Male" | "Female";
}

let waitingQueue: WaitingList[] = [];
const activeUsers = new Set<string>();

export const handleMatchmaking = (io: Server, socket: Socket) => {
  socket.on("join-matchmaking", (data?: { interestedIn?: "Male" | "Female" | "Both" }) => {
    const user = socket.data?.user as UserInt | undefined;
    if (!user?.id) {
      socket.emit("match-error", "User authentication failed!");
      return;
    }

    const userId = user.id.toString();
    const gender = user.gender;
    const interestedIn = data?.interestedIn || user.interestedIn || "Both";


    if (activeUsers.has(userId)) {
      activeUsers.delete(userId);
    }
    waitingQueue = waitingQueue.filter((u) => u.userId !== userId && u.socketId !== socket.id);

    let matchIndex = -1;

    for (const [index, candidate] of waitingQueue.entries()) {
      if (candidate.userId !== userId) {
        const partnerSocket = io.sockets.sockets.get(candidate.socketId);
        if (partnerSocket && partnerSocket.connected) {
          matchIndex = index;
          break;
        }
      }
    }

    if (matchIndex !== -1) {
      const partner = waitingQueue.splice(matchIndex, 1)[0];
      if (!partner) return;

      const roomId = `room-${uuidv4()}`;

      activeUsers.add(userId);
      activeUsers.add(partner.userId);

      const partnerSocket = io.sockets.sockets.get(partner.socketId);

      socket.join(roomId);
      partnerSocket?.join(roomId);

      console.log(`[Match Success] Room: ${roomId} | ${userId} <---> ${partner.userId}`);

      const payload1 = { roomId, partnerId: partner.userId };
      const payload2 = { roomId, partnerId: userId };

      socket.emit("match-found", payload1);
      socket.emit("matched", payload1);

      if (partnerSocket) {
        partnerSocket.emit("match-found", payload2);
        partnerSocket.emit("matched", payload2);
      }
    } else {
      waitingQueue.push({
        socketId: socket.id,
        userId,
        gender,
        interestedIn,
      });

      console.log(` [Waiting Queue] Added: ${userId}. Total: ${waitingQueue.length}`);
      socket.emit("waiting-for-match", "Searching for a partner...");
    }
  });

  socket.on("join-room", ({ roomId }: { roomId: string }) => {
    if (roomId) {
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room: ${roomId}`);
    }
  });

  socket.on("send-message", ({ roomId, messages, message }: { roomId: string; messages?: string; message?: string }) => {
    const user = socket.data?.user as UserInt | undefined;
    const textMsg = message || messages;

    if (!user?.id || !roomId || !textMsg) return;

    socket.to(roomId).emit("receive-message", {
      senderId: user.id.toString(),
      message: textMsg,
      createdAt: new Date().toISOString(),
    });
  });

  socket.on("typing", ({ roomId }: { roomId: string }) => {
    socket.to(roomId).emit("user-typing", { isTyping: true });
  });

  socket.on("stop-typing", ({ roomId }: { roomId: string }) => {
    socket.to(roomId).emit("user-typing", { isTyping: false });
  });

  const cleanupUser = (userId: string | undefined, notifyPartner: boolean = false) => {
    waitingQueue = waitingQueue.filter((u) => u.userId !== userId && u.socketId !== socket.id);
    if (userId) activeUsers.delete(userId);

    for (const roomId of socket.rooms) {
      if (roomId !== socket.id) {
        if (notifyPartner) {
          socket.to(roomId).emit("partner-left");
        }
        socket.leave(roomId);
      }
    }
  };

  socket.on("leave-room", () => {
    const user = socket.data?.user as UserInt | undefined;
    cleanupUser(user?.id?.toString(), true); 
  });

  socket.on("cancel-matchmaking", () => {
    const user = socket.data?.user as UserInt | undefined;
    cleanupUser(user?.id?.toString(), false);
  });

  socket.on("disconnecting", () => {
    const user = socket.data?.user as UserInt | undefined;
    for (const roomId of socket.rooms) {
      if (roomId !== socket.id) {
        socket.to(roomId).emit("partner-left");
      }
    }
    cleanupUser(user?.id?.toString(), false);
  });
};