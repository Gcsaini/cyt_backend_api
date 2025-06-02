import mongoose from "mongoose";
const { Schema } = mongoose;
const favoriteTherapistSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  therapists: [
    {
      type: Schema.Types.ObjectId,
      ref: "Therapists",
      required: true,
    },
  ],
});

export default mongoose.model("FavoriteTherapist", favoriteTherapistSchema);
