import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    bannerImage: {
      type: String,
      required: [true, "Banner image path/URL is required"],
    },
    techStack: {
      type: [String],
      default: [],
    },
    githubLink: {
      type: String,
      default: "",
    },
    liveLink: {
      type: String,
      default: "",
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Project || mongoose.model("Project", ProjectSchema);
