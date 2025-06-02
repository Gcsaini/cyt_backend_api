import mongoose from "mongoose";
const { Schema } = mongoose;

const TodoSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    leader: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reporter: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    task: {
      type: String,
      required: true,
    },
    jira: {
      type: String,
      default: null,
    },
    start_date: {
      type: Date,
      default: Date.now,
    },
    done_at: {
      type: Date,
      default: null,
    },
    priority: {
      type: Number,
      default: 1,
    },
    status: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

//status
//Pending -1
//WIP-2
//Done-3
//sent for qc-4

//priority
//Low-3
//Medium-2
//High-1

export default mongoose.model("Todo", TodoSchema);
