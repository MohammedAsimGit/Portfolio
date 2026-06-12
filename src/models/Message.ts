import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Sender name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Sender email is required"],
      trim: true,
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
    },
    message: {
      type: String,
      required: [true, "Message content is required"],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Message || mongoose.model("Message", MessageSchema);
