import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const expertiseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      trim: true,
      required: "Expertise Name required",
      minlength: [2, "Expertise too short"],
      maxlength: [32, "Expertise too long"],
    },
    colorRgb: {
      type: String,
      unique: false,
      trim: true,
      required: "Color RGB required",
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    parent: {
      type: ObjectId,
      ref: "Sector",
      required: "Sector is required",
    },
    status: {
      type: String,
      trim: true,
      enum: ["active", "disabled"],
      default: "active",
    },
    postedBy: {
      type: ObjectId,
      ref: "User",
      required: "Admin Posted required",
    },
  },
  {
    timestamps: true,
  }
);
const Expertise = mongoose.model("Expertise", expertiseSchema);
export default Expertise;
