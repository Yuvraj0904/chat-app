import mongoose from "mongoose";

const privateMessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const PrivateMessage =
  mongoose.models.PrivateMessage ||
  mongoose.model("PrivateMessage", privateMessageSchema);

export default PrivateMessage;
