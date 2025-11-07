import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();
import authRoutes from "./routes/authroute.js";
import {connectDB} from "./lib/db.js";
const app=express();
const PORT=process.env.PORT || 8000;

app.use("/api/auth",authRoutes);
app.use(express.json());
app.use(cookieParser());
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});
