import userModel from "../models/userModel.js";

export const getUserData = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "user not found" });
    }

    return res.json({
      success: true,
      userData: {
        _id: user._id,
        name: user.name,
        isAccountVerified: user.isAccountVerified,
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
export const getAllUsers = async (req, res) => {
  try {

    const currentUserId = req.userId;

    const users = await userModel
      .find({
        _id: { $ne: currentUserId },
      })
      .select("-password");

    return res.json({
      success: true,
      users,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};