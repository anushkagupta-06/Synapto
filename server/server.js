import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import pdfRoutes from './routes/pdfRoutes.js';
import attendanceRoutes from "./routes/attendanceRoutes.js";
import chatBotRoutes from "./routes/chatBotRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import twilioRoutes from "./routes/twilioRoutes.js"
import  MassBunkRoutes from "./routes/MassBunkRoutes.js"
import http from 'http';
import { Server } from 'socket.io';
import { setupChatSocket } from './sockets/chatSocket.js';
import userSettingsRoutes from './routes/userSettingsRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import deadlineRoutes from './routes/DeadlineRoutes.js';





connectDB();

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  process.env.CLIENT_URL ||"*" || "https://synapto.vercel.app", // keep for local dev
];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  }
});


app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.some(o => origin.startsWith(o))) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));
 
app.options("*", cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.some(o => origin.startsWith(o))) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(express.json());

console.log("Mounting route: /api/auth");
app.use('/api/auth', authRoutes);
console.log("Mounting route: /api/pdf");
app.use('/api/pdf', pdfRoutes);
console.log("Mounting route: /api/attendance");
app.use('/api/attendance', attendanceRoutes);
console.log("Mounting route: /api/chatbot");
app.use("/api/chatbot", chatBotRoutes);
console.log("Mounting route: /api/chat");
app.use('/api/chat', chatRoutes); 


// Socket.io
setupChatSocket(io);
// app.use("/api/videos",videoRoutes);
console.log("Mounting: /api/user");
app.use("/api/user", userSettingsRoutes);
console.log("Mounting: /api/deadlines");
app.use('/api/deadlines', deadlineRoutes);
console.log("Mounting: /api/notes");
app.use('/api/notes', noteRoutes);
console.log("Mounting: /api/alert");
app.use("/api/alert",twilioRoutes);
console.log("Mounting: /api/massbunk");
app.use("/api/massbunk",MassBunkRoutes)


app.get("/", (req, res) => {
  res.send("EduHub API is running 🚀");
});
const PORT = process.env.PORT || 5050;

server.listen(PORT, () => {
  console.log(`Server running at ${process.env.VITE_API_URL}`);
});