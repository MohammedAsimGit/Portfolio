import mongoose from "mongoose";

const SettingSchema = new mongoose.Schema(
  {
    aboutBio: {
      type: String,
      default: "",
    },
    careerObjective: {
      type: String,
      default: "",
    },
    githubUrl: {
      type: String,
      default: "",
    },
    linkedinUrl: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Setting || mongoose.model("Setting", SettingSchema);
