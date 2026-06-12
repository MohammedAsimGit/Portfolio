import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema(
  {
    pdfUrl: {
      type: String,
      required: [true, "Resume PDF file URL is required"],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Resume || mongoose.model("Resume", ResumeSchema);
