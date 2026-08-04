import dotenv from 'dotenv'
import express from 'express'
import type {Request,Response} from 'express'
import mongoose from 'mongoose';
import router from './routes/authRoute.js';
import { createServer } from 'http';
import { initSocket } from './socket/socket.config.js';

dotenv.config()

const app = express()
app.use(express.json())
const port = 3000

const httpServer = createServer(app)
initSocket(httpServer)

const mongdbUrl  = process.env.MONGODB_URL as string

const connetDb = async ()=>{
  try {
   await mongoose.connect(mongdbUrl)
   console.log("he hai")
  } catch (error) {
    console.log("dont ")
  }
}
connetDb()
app.get('/',(req:Request ,res:Response)=>{
  res.send('hello wold')
})
app.use('/api/auth',router)

httpServer.listen(port,()=>{
  console.log(`Server and Socket listening on port ${port}`);
})