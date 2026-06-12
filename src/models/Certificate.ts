import mongoose from "mongoose";

const CertificateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Certificate title is required"],
      trim: true,
    },
    issuer: {
      type: String,
      required: [true, "Issuer is required"],
      trim: true,
    },
    date: {
      type: String,
      required: [true, "Issue date is required"],
    },
    image: {
      type: String,
      required: [true, "Certificate preview image is required"],
    },
    pdf: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Certificate || mongoose.model("Certificate", CertificateSchema);
