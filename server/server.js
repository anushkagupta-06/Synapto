import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import pdfRoutes from './routes/pdfRoutes.js';
import attendanceRoutes from "./routes/attendanceRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

dotenv.config();

connectDB();

const app = express();

// app.use(cors()); // Enable CORS
const corsOptions = {
  origin: ['http://localhost:5173','http://localhost:5050'], // Allowed 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  credentials: true, // Allow conookies and credentials
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/auth', authRoutes);

app.use('/api/pdf', pdfRoutes);

app.use('/api/attendance', attendanceRoutes);

app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => {
  res.send("EduHub API is running 🚀");
});
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
