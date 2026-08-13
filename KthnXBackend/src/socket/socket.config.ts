import {Server as HttpServer} from 'http'
import {Server} from 'socket.io'
import { socketAuth } from '../Middlewares/authMiddleware.js';
import { handleMatchmaking } from './match.js';

export const initSocket = (httpServer : HttpServer)=>{
  const allowedOrigins = [
    'http://localhost:3000',
    'http://192.168.10.219:3000',
    process.env.CLIENT_URL,
  ].filter(Boolean) as string[];

 const io = new Server(httpServer, {
    cors: {
      origin: (origin, callback) => {
        // Postman/Mobile, Allowed Origins, অথবা যেকোনো *.vercel.app ডোমেইন অ্যালাউ করবে
        if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.use(socketAuth)

  io.on("connection",(socket)=>{
    handleMatchmaking(io,socket)
  })
  return io
}