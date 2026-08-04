import {Server as HttpServer} from 'http'
import {Server} from 'socket.io'
import { socketAuth } from '../Middlewares/authMiddleware.js';
import { handleMatchmaking } from './match.js';

export const initSocket = (httpServer : HttpServer)=>{
  const io = new Server(httpServer,{
    cors:{
      origin:'*',
      methods:['GET','POST']
    }
  })

  io.use(socketAuth)

  io.on("connection",(socket)=>{
    handleMatchmaking(io,socket)
  })
  return io
}