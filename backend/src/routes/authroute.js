import express from "express";
import {login,logout,signup} from "../controllers/authcontroller.js";;
const router=express.Router();
router.post("/signup",signup);
router.post("/login",login);
router.post("/logout",logout);
router.post("/onboarding",protectedRoute,onboard);

//check if the user is logged in
router.get("/me",protectedRoute,(req,res)=>{
    res.status(200).json({sucess:true,user:req.user});
});

export default router;
