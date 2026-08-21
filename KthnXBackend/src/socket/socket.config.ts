import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { socketAuth } from '../Middlewares/authMiddleware.js';
import { handleMatchmaking } from './match.js';

export interface ServerToClientEvents {
  "receive-message": (data: { senderId: string; message: string; createAt: string }) => void;
  "user-typing": (data: { isTyping: boolean }) => void;
  "partner-left": () => void;
  [key: string]: any;
}

export interface ClientToServerEvents {
  "send-message": (data: { roomId: string; messages: string }) => void;
  "typing": (data: { roomId: string }) => void;
  "stop-typing": (data: { roomId: string }) => void;
  "leave-room": () => void;
  [key: string]: any;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  userId?: string;
  user?: any;
}

export type CustomSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

export const initSocket = (httpServer: HttpServer): Server => {
  const allowedOrigins: string[] = [
    'http://localhost:3000',
    'http://192.168.10.219:3000',
    process.env.CLIENT_URL,
  ].filter(Boolean) as string[];

  const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >(httpServer, {
    cors: {
      origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  io.use(socketAuth);

  io.on('connection', (socket: CustomSocket) => {

    handleMatchmaking(io, socket);

    socket.on('error', (err: Error) => {
    });

    socket.on('disconnect', (reason: string) => {
    });
  });

  return io;
};