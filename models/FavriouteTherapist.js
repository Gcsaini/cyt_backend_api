import mongoose from "mongoose";
const { Schema } = mongoose;
const favoriteTherapistSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  therapist: {
    type: Schema.Types.ObjectId,
    ref: "Therapists",
    required: true,
  }
});

export default mongoose.model("FavoriteTherapist", favoriteTherapistSchema);
