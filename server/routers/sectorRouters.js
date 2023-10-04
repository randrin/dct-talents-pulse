import express from "express";
import { isMember } from "../middlewares/index.js";
import {
  TALENTS_PULSE_ACTION_SECTOR,
  TALENTS_PULSE_CREATE_SECTOR,
  TALENTS_PULSE_DELETE_SECTOR,
  TALENTS_PULSE_SECTORS,
  TALENTS_PULSE_SECTOR_FIND_BY_ID,
  TALENTS_PULSE_UPDATE_SECTOR,
} from "../utils/apiUrlUtils.js";
import {
  getListSectors,
  getSectorById,
  sectorCreate,
  sectorDelete,
  sectorEnableOrDisable,
  sectorUpdate,
} from "../controllers/sectorController.js";

const sectorRouter = express.Router();

sectorRouter.post(TALENTS_PULSE_CREATE_SECTOR, isMember, sectorCreate);
sectorRouter.get(TALENTS_PULSE_SECTORS, getListSectors);
sectorRouter.get(TALENTS_PULSE_SECTOR_FIND_BY_ID, getSectorById);
sectorRouter.put(TALENTS_PULSE_UPDATE_SECTOR, isMember, sectorUpdate);
sectorRouter.put(TALENTS_PULSE_ACTION_SECTOR, isMember, sectorEnableOrDisable);
sectorRouter.delete(TALENTS_PULSE_DELETE_SECTOR, isMember, sectorDelete);

export default sectorRouter;
