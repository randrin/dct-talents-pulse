import express from "express";
import {
  TALENTS_PULSE_CREATE_DCT,
  TALENTS_PULSE_CREATE_DCT_BY_MEMBER,
  TALENTS_PULSE_DCTS,
  TALENTS_PULSE_DCT_FIND_BY_ID,
  TALENTS_PULSE_DCT_FIND_BY_TOKEN,
  TALENTS_PULSE_DELETE_DCT,
  TALENTS_PULSE_DOWNLOAD_DCT,
  TALENTS_PULSE_FILTER_DCTS,
  TALENTS_PULSE_UPDATE_DCT,
  TALENTS_PULSE_UPDATE_MATRICULE_DCT,
} from "../utils/apiUrlUtils.js";
import {
  dctCreate,
  dctUpdate,
  dctUpdateMatricule,
  getDctById,
  getDctByToken,
  getListDcts,
  dctDownload,
  dctDelete,
  dctsFilter
} from "../controllers/dctController.js";
import { isAuthenticated, isMember } from "../middlewares/index.js";

const dctRouter = express.Router();

dctRouter.post(TALENTS_PULSE_CREATE_DCT, dctCreate);
dctRouter.post(TALENTS_PULSE_FILTER_DCTS, isMember, dctsFilter);
dctRouter.post(TALENTS_PULSE_DOWNLOAD_DCT, isAuthenticated, dctDownload);
dctRouter.get(TALENTS_PULSE_DCTS, isMember, getListDcts);
dctRouter.get(TALENTS_PULSE_DCT_FIND_BY_ID, isAuthenticated, getDctById);
dctRouter.get(TALENTS_PULSE_DCT_FIND_BY_TOKEN, isAuthenticated, getDctByToken);
dctRouter.put(TALENTS_PULSE_UPDATE_DCT, isAuthenticated, dctUpdate);
dctRouter.put(TALENTS_PULSE_UPDATE_MATRICULE_DCT, isAuthenticated, dctUpdateMatricule);
dctRouter.delete(TALENTS_PULSE_DELETE_DCT, isMember, dctDelete);

export default dctRouter;
