import mongoose from "mongoose";

const SkillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Skill name is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Programming Languages",
        "Frontend Development",
        "Backend Development",
        "Database Technologies",
        "AI & Machine Learning",
        "Development Tools",
      ],
    },
    level: {
      type: Number,
      required: [true, "Skill level (0-100) is required"],
      min: 0,
      max: 100,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Skill || mongoose.model("Skill", SkillSchema);
