import userModel from "../models/userModel.js";

export const sendFriendRequest = async (req, res) => {
  try {
    const senderId = req.userId;
    const receiverId = req.params.id;

    if (senderId === receiverId) {
      return res.json({
        success: false,
        message: "You cannot send a friend request to yourself",
      });
    }

    const sender = await userModel.findById(senderId);
    const receiver = await userModel.findById(receiverId);
    if (!receiver) {
      return res.json({
        success: false,
        message: "You cannot send a friend request to yourself",
      });
    }
    if (sender.friends.includes(receiverId)) {
      return res.json({
        success: false,
        message: "Already friends",
      });
    }
    if (receiver.friendRequests.includes(senderId)) {
      return res.json({
        success: false,
        message: "Friend request already sent",
      });
    }

    receiver.friendRequests.push(senderId);
    await receiver.save();
    return res.json({
      success: true,
      message: "Friend request sent",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};
// Accept Friend Request
export const acceptFriendRequest = async (req, res) => {
  try {
    const currentUserId = req.userId; // logged in user
    const senderId = req.params.id; // user who sent request

    const currentUser = await userModel.findById(currentUserId);
    const sender = await userModel.findById(senderId);

    if (!sender) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    // Check if request exists
    if (!currentUser.friendRequests.includes(senderId)) {
      return res.json({
        success: false,
        message: "No friend request found",
      });
    }

    // Add both users as friends
    currentUser.friends.push(senderId);
    sender.friends.push(currentUserId);

    // Remove request
    currentUser.friendRequests = currentUser.friendRequests.filter(
      (id) => id.toString() !== senderId,
    );

    await currentUser.save();
    await sender.save();

    return res.json({
      success: true,
      message: "Friend request accepted",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};
export const allFriendRequest = async (req, res) => {
  try {
    const currentUserId = req.userId;

    const currentUser = await userModel
      .findById(currentUserId)
      .populate("friendRequests", "name email");

    if (!currentUser) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      friendRequests: currentUser.friendRequests,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};
export const allFriends = async (req, res) => {
  try {
    const userId = req.userId;

    const currentUser = await userModel
      .findById(userId)
      .populate("friends", "name email");

    if (!currentUser) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      friends: currentUser.friends,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};
export const rejectFriendRequest=async(req,res)=>{
 try {
   const currentUserId = req.userId;
   const senderId = req.params.id;

   const currentUser = await User.findById(currentUserId);

   if (!currentUser) {
     return res.json({
       success: false,
       message: "User not found",
     });
   }
   // Check if request exists
   if (!currentUser.friendRequests.includes(senderId)) {
     return res.json({
       success: false,
       message: "No friend request found",
     });
   }
   // Remove request
   currentUser.friendRequests = currentUser.friendRequests.filter(
     (id) => id.toString() !== senderId,
   );
    await currentUser.save();

    return res.json({
      success: true,
      message: "Friend request rejected",
    });

 } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
 }
}