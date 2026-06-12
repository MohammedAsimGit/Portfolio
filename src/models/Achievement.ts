import mongoose from "mongoose";

const AchievementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Achievement title is required"],
      trim: true,
    },
    date: {
      type: String,
      required: [true, "Date achieved is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    category: {
      type: String,
      enum: ["hackathon", "competition", "achievement"],
      default: "achievement",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Achievement || mongoose.model("Achievement", AchievementSchema);
