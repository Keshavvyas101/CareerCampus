import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import analysisRoutes from "./routes/analysisRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";

// Load env variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// CORS settings to support frontend on localhost:3000
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];



app.use(cors({
  origin: "https://careercampus-frontend.onrender.com",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.options("*", cors());




// Middlewares
app.use(express.json()); // JSON body parser
app.use(cookieParser()); // Parse cookies

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/analysis", analysisRoutes);
app.use("/api", profileRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("🌍 CareerCompass API is running...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
