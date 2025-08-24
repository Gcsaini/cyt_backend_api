import mongoose from "mongoose";
const { Schema } = mongoose;

const upiInfoSchema = new Schema({
  upi_id: {
    type: String,
    required:true
  },
  name: {
    type: String,
    required: true,
  },
});

export default mongoose.model("UpiInfo", upiInfoSchema);
