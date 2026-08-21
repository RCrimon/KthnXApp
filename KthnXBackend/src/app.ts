import dotenv from 'dotenv'
import express from 'express'
import type { Request, Response } from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import router from './routes/authRoute.js'
import { createServer } from 'http'
import { initSocket } from './socket/socket.config.js'

dotenv.config()

const app = express()

const allowedOrigins = [
  'http://localhost:3000',
  'http://192.168.10.219:3000',
  process.env.CLIENT_URL,
].filter(Boolean) as string[];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true,
};

app.use(cors(corsOptions));


app.use(express.json());

const port = process.env.PORT || 5000;
const mongodbUrl = process.env.MONGODB_URL as string;

const httpServer = createServer(app);
initSocket(httpServer);

app.get('/', (req: Request, res: Response) => {
  res.send('Server and Socket System Running Smoothly');
});

app.use('/api/auth', router);

const connectDb = async () => {
  try {
    if (!mongodbUrl) {
      throw new Error('MONGODB_URL is not defined inside environment variables');
    }
    await mongoose.connect(mongodbUrl);
    httpServer.listen(port, () => {
    });
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

connectDb();