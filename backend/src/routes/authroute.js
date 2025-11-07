import express from "express";
const router=express.Router();

router.get("/signup",(req,res)=>{
    res.send("Signup Route");
});

router.get("/login",(req,res)=>{
    res.send()
})