import mongoose from "mongoose";
const { Schema } = mongoose;

const timeSchema = new Schema({
  open: {
    type: String,
    required: true,
  },
  close: {
    type: String,
    required: true,
  },
});

const scheduleSchema = new Schema({
  day: {
    type: String,
    required: true,
  },
  times: [timeSchema],
});

const AvailbilitySchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: true,
  },
  schedule: [scheduleSchema],
});

export default mongoose.model("Availabilities", AvailbilitySchema);
