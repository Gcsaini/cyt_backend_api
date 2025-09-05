import mongoose from "mongoose";
const { model, Schema } = mongoose;
const NotifySchema = new Schema({
  url: { type: String,},
  title: { type: String, required: true },
});
export default model("Notify", NotifySchema);
