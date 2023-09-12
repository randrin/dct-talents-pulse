import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const sectorSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      unique: true,
      trim: true,
      required: "Sector Name required",
      minlength: [2, "Only 2 letters allowed"],
      maxlength: [2, "Only 2 letters allowed"],
    },
    name: {
      type: String,
      unique: true,
      trim: true,
      required: "Sector Name required",
      minlength: [2, "Sector name too short"],
      maxlength: [32, "Sector name too long"],
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
const Sector = mongoose.model("Sector", sectorSchema);
export default Sector;
