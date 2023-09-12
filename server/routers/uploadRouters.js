import express from "express";
import { isAuthenticated } from "../middlewares/index.js";
import { TALENTS_PULSE_REMOVE_IMAGE, TALENTS_PULSE_UPLOAD_IMAGES } from "../utils/apiUrlUtils.js";
import { uploadImages, removeImage } from "../controllers/uploadController.js";

const uploadRouter = express.Router();

uploadRouter.post(TALENTS_PULSE_UPLOAD_IMAGES, isAuthenticated, uploadImages);
uploadRouter.post(TALENTS_PULSE_REMOVE_IMAGE, isAuthenticated, removeImage);

export default uploadRouter;