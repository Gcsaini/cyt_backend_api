import mongoose from "mongoose";
const { model, Schema } = mongoose;
const FileSchema = new Schema({
  url: { type: String, required: true }, // S3 URL or file URL
  fileName: { type: String, required: true },
  fileSize: { type: Number, required: true }, // In bytes
  fileType: { type: String, required: true }, // MIME type
  uploadedAt: { type: Date, default: Date.now },
});
export default model("FileMeta", FileSchema);
