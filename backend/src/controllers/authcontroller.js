import { upsertStreamUser } from "../lib/stream";

export async function signup(req,res){
try{
    const {email,password,fullName}=req.body;
    const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!email || !password || !fullName){
        return res.status(400).json({message:"All fields are required"});
    }
    if(password.length<6){
        return res.status(400).json({message:"Password must be at least 6 characters long"});
    }
    if(!emailRegex.test(email)){
        return res.status(400).json({message:"Invalid email format"});
    }
    const existingUser=await User.findOne({email});
    if(existingUser){
        return res.status(400).json({message:"User already exists"});
    }
    const idx=Math.floor(Math.random()*100)+1;
    const randomAvatar=`https://avatar.iran.liaran.run/public/${idx}.png`;
    const newUser=new User.create({
        email,
        fullName,
        password,
        profilePic:randomAvatar,
    });
   try{
    await upsertStreamUser({
        id:newUser._id.toString(),
        name:newUser.fullName,
        image:newUser.profilePic || "";
    })
   }catch(error){
    console.log(error);
    res.status(500).json({message:"Internal Server Error"});
   }
   const token=jwt.sign({userId:newUser._id},process.env.JWT_SECRET,{expiresIn:"1d"});
   res.cookie("jwt",token,{
      maxAge:7*24*60*60*1000,
      httpOnly:true,//prevent XSS attacks
      secure:true,
      sameSite:"strict",
      secure:process.env.NODE_ENV=="production",
   })
   res.status(201).json({sucesss:true,user:newUser});
 }catch(error){
    console.log(error);
    res.status(500).json({message:"Internal Server Error"});
  }
}
export async function login(req,res){
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({message:"All fields are required"});
        }
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"User not found"});
        }
        const isPasswordValid=await bcrypt.compare(password,user.password);
        if(!isPasswordValid){
            return res.status(400).json({message:"Invalid password"});
        }
        const token=jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:"1d"});
        res.cookie("jwt",token,{
            maxAge:7*24*60*60*1000,
            httpOnly:true,//prevent XSS attacks
            secure:true,
            sameSite:"strict",
            secure:process.env.NODE_ENV=="production",
        })
        res.status(200).json({sucesss:true,user:user});
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Internal Server Error"});
    }
}

export async function logout(req,res){
    res.clearCookie("jwt");
    res.status(200).json({success:true,message:"User logged out successfully"});
}

export async function onboard(req,res){
    
}