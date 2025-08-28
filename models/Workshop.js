import mongoose from "mongoose";
const { model } = mongoose;
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  name: { type: String, required: true },
  image: { type: String, required: false }, // URL or path to the image
  review: { type: String, required: true },
  star: { type: Number, required: true, min: 1, max: 5 }, // Assuming star ratings are between 1 and 5
});

const WorkshopSchema = new Schema(
  {
    post_by: { type: Schema.Types.ObjectId, required: true, ref: "Therapists" },
    title: { type: String, required: true },
    category: { type: String, required: true },
    short_desc: { type: String, required: true },
    desc: { type: String, required: true },
    level: { type: String, required: true },
    event_time: { type: String, required: true },
    duration: { type: String, required: true },
    language: { type: String, required: true },
    event_date: { type: String, default: null },
    event_end_date: { type: String, default: null },
    mrp: { type: String, required: true },
    price: { type: String, required: true },
    content_pdf: { type: String, default: null },
    workshop_image: { type: String, default: null },
    is_active: { type: Number, default: 1 },
    reviews: [reviewSchema],
  },
  { timestamps: true }
);

export default model("Workshops", WorkshopSchema);
