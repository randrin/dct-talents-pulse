import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const activitySchema = new mongoose.Schema(
  {
    activityType: {
      type: String,
      trim: true,
    },
    dct: {
      type: ObjectId,
      ref: "Dct",
    },
    user: {
      type: ObjectId,
      ref: "User",
      required: "User required",
    },
  },
  {
    timestamps: true,
  }
);
const Activity = mongoose.model("Activity", activitySchema);
export default Activity;
