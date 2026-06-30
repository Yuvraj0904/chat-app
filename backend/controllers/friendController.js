import userModel from "../models/userModel.js";

// Send Friend Request
export const sendFriendRequest = async (req, res) => {
  try {
    const senderId = req.userId;
    const receiverId = req.params.id;

    // Cannot send request to yourself
    if (senderId === receiverId) {
      return res.json({
        success: false,
        message: "You cannot send a friend request to yourself",
      });
    }

    const sender = await userModel.findById(senderId);
    const receiver = await userModel.findById(receiverId);

    // Receiver not found
    if (!receiver) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    // Already friends
    if (sender.friends.includes(receiverId)) {
      return res.json({
        success: false,
        message: "Already friends",
      });
    }

    // Request already sent
    if (receiver.friendRequests.includes(senderId)) {
      return res.json({
        success: false,
        message: "Friend request already sent",
      });
    }

    // Receiver has already sent you a request
    if (sender.friendRequests.includes(receiverId)) {
      return res.json({
        success: false,
        message: "This user has already sent you a request",
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
    const currentUserId = req.userId;
    const senderId = req.params.id;

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

    // Remove request
    currentUser.friendRequests = currentUser.friendRequests.filter(
      (id) => id.toString() !== senderId,
    );

    await currentUser.save();

    // Add friends without duplicates
    await userModel.findByIdAndUpdate(currentUserId, {
      $addToSet: { friends: senderId },
    });

    await userModel.findByIdAndUpdate(senderId, {
      $addToSet: { friends: currentUserId },
    });

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

// Reject Friend Request
export const rejectFriendRequest = async (req, res) => {
  try {
    const currentUserId = req.userId;
    const senderId = req.params.id;

    const currentUser = await userModel.findById(currentUserId);

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
};

// Get All Friend Requests
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

// Get All Friends
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
export const removeFriend = async (req, res) => {
  try {
    const currentUserId = req.userId;
    const friendId = req.params.id;

    await userModel.findByIdAndUpdate(currentUserId, {
      $pull: { friends: friendId },
    });

    await userModel.findByIdAndUpdate(friendId, {
      $pull: { friends: currentUserId },
    });

    return res.json({
      success: true,
      message: "Friend removed successfully",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};