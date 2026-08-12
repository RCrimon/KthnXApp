import {Server as HttpServer} from 'http'
import {Server} from 'socket.io'
import { socketAuth } from '../Middlewares/authMiddleware.js';
import { handleMatchmaking } from './match.js';

export const initSocket = (httpServer : HttpServer)=>{
  const io = new Server(httpServer,{
   cors: {
      origin: ['http://localhost:3000', 'http://192.168.10.219:3000'],
      methods: ['GET', 'POST'],
      credentials: true, 
    },
  })

  io.use(socketAuth)

  io.on("connection",(socket)=>{
    handleMatchmaking(io,socket)
  })
  return io
}