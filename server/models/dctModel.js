import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const dctSchema = new mongoose.Schema(
  {
    sector: {
      type: ObjectId,
      ref: "Sector",
      required: "Sector required",
    },
    expertise: {
      type: ObjectId,
      ref: "Expertise",
      required: "Expertise required",
    },
    matricule: {
      type: String,
      trim: true,
      default: ""
    },
    nationality: { type: String, trim: true },
    expNumber: { type: Number, trim: true },
    description: { type: String, trim: true, default: "" },
    skills: { type: Array, default: [] },
    projects: { type: Array, default: [] },
    projectsDetail: {
      type: Array,
      default: [],
    },
    formations: { type: Array, default: [] },
    tecnicalSkills: {
      type: Array,
      default: [],
    },
    linguistics: { type: Array, default: [] },
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
const Dct = mongoose.model("Dct", dctSchema);
export default Dct;
