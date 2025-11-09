import User from "../models/User";
export async function getRecommendedUsers(req,res){
    try{
        const currentUserId=req.user._id;
        const currentUser=await User.findById(currentUserId);

        const recommendedUsers=await User.find({
            $and:[
                {_id:{$ne:currentUserId}},//exclude current user
                {$id:{$nin:currentUser.friends}},//exclude current user friends
                {isOnboarded:true},
                
            ]
            
        })
        res.status(200).json({success:true,recommendedUsers});
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Internal Server Error"});
    }
}

export async function getMyFriends(req,res){
    try{
        const user=await User.findById(req.user.id).select("friends")
        .populate("friends","fullName profilePic nativeLanguage learningLanguage");

         res.status(200).json(user.friends);
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Internal Server Error"});
    }
}