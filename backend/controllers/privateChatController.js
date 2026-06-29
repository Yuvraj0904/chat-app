import PrivateMessage from "../models/PrivateMessage.js";

export const sendPrivateMessage = async (req, res) => {
  try {
    const senderId = req.userId;
    const { receiverId, message } = req.body;

    const newMessage = await PrivateMessage.create({
      sender: senderId,
      receiver: receiverId,
      message,
    });

    return res.json({
      success: true,
      message: "Message sent",
      newMessage,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const getPrivateMessages = async (req, res) => {
  try {
    const currentUserId = req.userId;
    const friendId = req.params.friendId;

    const messages = await PrivateMessage.find({
      $or: [
        {
          sender: currentUserId,
          receiver: friendId,
        },
        {
          sender: friendId,
          receiver: currentUserId,
        },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("sender", "name")
      .populate("receiver", "name");

    return res.json({
      success: true,
      messages,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};
