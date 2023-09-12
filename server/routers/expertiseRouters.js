import express from "express";
import { isMember } from "../middlewares/index.js";
import {
  TALENTS_PULSE_ACTION_EXPERTISE,
  TALENTS_PULSE_CREATE_EXPERTISE,
  TALENTS_PULSE_DELETE_EXPERTISE,
  TALENTS_PULSE_EXPERTISES,
  TALENTS_PULSE_EXPERTISES_FIND_BY_SECTOR,
  TALENTS_PULSE_EXPERTISE_FIND_BY_ID,
  TALENTS_PULSE_UPDATE_EXPERTISE,
} from "../utils/apiUrlUtils.js";
import {
  expertiseCreate,
  expertiseDelete,
  expertiseEnableOrDisable,
  expertiseUpdate,
  getExpertisesBySector,
  getListExpertises,
  getExpertisesById
} from "../controllers/expertiseController.js";

const expertiseRouter = express.Router();

expertiseRouter.post(TALENTS_PULSE_CREATE_EXPERTISE, isMember, expertiseCreate);
expertiseRouter.get(TALENTS_PULSE_EXPERTISES, getListExpertises);
expertiseRouter.get(TALENTS_PULSE_EXPERTISES_FIND_BY_SECTOR, getExpertisesBySector);
expertiseRouter.get(TALENTS_PULSE_EXPERTISE_FIND_BY_ID, getExpertisesById);
expertiseRouter.put(TALENTS_PULSE_UPDATE_EXPERTISE, isMember, expertiseUpdate);
expertiseRouter.put(TALENTS_PULSE_ACTION_EXPERTISE, isMember, expertiseEnableOrDisable);
expertiseRouter.delete(TALENTS_PULSE_DELETE_EXPERTISE, isMember, expertiseDelete);

export default expertiseRouter;
