import mongoose from "mongoose";

const ExperienceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job/Internship title is required"],
      trim: true,
    },
    company: {
      type: String,
      required: [true, "Company/Organization name is required"],
      trim: true,
    },
    location: {
      type: String,
      default: "",
    },
    startDate: {
      type: String,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: String,
      default: "Present",
    },
    description: {
      type: [String],
      default: [],
    },
    type: {
      type: String,
      enum: ["internship", "leadership", "job"],
      default: "internship",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Experience || mongoose.model("Experience", ExperienceSchema);
