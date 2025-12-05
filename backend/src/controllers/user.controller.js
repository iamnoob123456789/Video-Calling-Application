import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";
export async function sendFriendRequest(req, res) {
    try {
        const { id: recipientId } = req.params;
        const senderId = req.user._id;

        const existingRequest = await FriendRequest.findOne({
            sender: senderId,
            recipient: recipientId,
        });

        if (existingRequest) {
            return res.status(400).json({ message: "Friend request already sent" });
        }

        const newFriendRequest = new FriendRequest({
            sender: senderId,
            recipient: recipientId,
        });

        await newFriendRequest.save();
        res.status(201).json({ message: "Friend request sent successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

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
export async function acceptFriendRequest(req,res){
    try{
        const {id:requestId}=req.params;
        const friendRequest=await FriendRequest.findById(requestId);
        if(!friendRequest){
            return res.status(404).json({message:"Friend request not found"});
        }
        if(friendRequest.reciptent.toString()!=req.user.id){
            return res.status(403).json({message:"Unauthorized"});
        }
        friendRequest.status="accepted";
        await friendRequest.save();
        
         //add each user to the other's friends array
        // $addToSet: adds elements to an array only if they do not aldready exist.
        await User.findByIdAndUpdate(friendRequest.sender,{
            $addToSet:{friends:friendRequest.reciptent},
        });
        await User.findByIdAndUpdate(friendRequest.reciptent,{
            $addToSet:{friends:friendRequest.sender},
        });
        
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Internal Server Error"});
    }
}

export async function getFriendRequests(req,res){
    try{
        const incomingRequests=await FriendRequest.find(
            {reciptent:req.user.id,
                status:"pending"}
        ).populate("sender","fullName profilePic nativeLanguage learningLanguage");
        const acceptedReqs=await FriendRequest.find({
            sender:req.user.id,
            status:"accepted"
           }).populate("reciptent","fullName profilePic");
        res.status(200).json({incomingReqs,acceptedReqs});
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Internal Server Error"});
    }

}

export async function getOutgoingFriendReqs(req,res){
    try{
        const outgoingRequests=await FriendRequest.find({
            sender:req.user.id,
            status:"pending",
        }).populate("reciptent","fullName profilePic nativeLanguage learningLanguage");

        res.status(200).json(outgoingRequests);
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Internal Server Error"});
    }
}