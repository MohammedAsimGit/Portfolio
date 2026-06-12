import mongoose from "mongoose";

const VisitorSchema = new mongoose.Schema(
  {
    ip: {
      type: String,
      required: true,
    },
    page: {
      type: String,
      default: "portfolio",
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Visitor || mongoose.model("Visitor", VisitorSchema);
