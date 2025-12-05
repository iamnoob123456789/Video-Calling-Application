import express from "express";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";

// Get the correct path to .env file (ONE level up from src)
const __dirname = path.resolve(); // This gives: C:\Users\shrey\Desktop\Zoom-App\backend\src

// Load .env from the backend root directory (go one level up)
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Debug: Check if env vars are loaded
console.log('Current directory:', __dirname);
console.log('Looking for .env at:', path.join(__dirname, '..', '.env'));
console.log('PORT:', process.env.PORT);
console.log('MONGO_URL exists:', !!process.env.MONGO_URL);
console.log('MONGO_URL value:', process.env.MONGO_URL ? 'Set' : 'Not set');

// Rest of your imports...
import authRoutes from "./routes/authroute.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";

import { connectDB } from "./lib/db.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});