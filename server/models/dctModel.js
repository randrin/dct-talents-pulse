import mongoose from "mongoose";
import { MONTH } from "../utils/constantsUtils.js";
const { ObjectId } = mongoose.Schema;

const dctSchema = new mongoose.Schema(
  {
    sector: {
      type: ObjectId,
      ref: "Sector",
      required: "Sector required",
    },
    expertiseUser: {
      type: String,
      trim: true,
      default: "",
    },
    expertise: {
      type: ObjectId,
      ref: "Expertise",
    },
    matricule: {
      type: String,
      trim: true,
      default: ""
    },
    nationality: { type: String, trim: true },
    expNumber: { type: Number, trim: true },
    description: { type: String, trim: true, default: "" },
    salaryType: { type: String, trim: true, default: MONTH },
    salaryRange: { type: Array, trim: true },
    salaryHour: { type: String, trim: true },
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
