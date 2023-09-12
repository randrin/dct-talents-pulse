import express from "express";
import {
  TALENTS_PULSE_ACTIVITIES,
  TALENTS_PULSE_CREATE_ACTIVITY,
  TALENTS_PULSE_DELETE_ACTIVITY,
  TALENTS_PULSE_UPDATE_ACTIVITY,
} from "../utils/apiUrlUtils.js";
import {
  activityCreate,
  activityDelete,
  activityUpdate,
  getListActivities,
} from "../controllers/activityController.js";
import { isMember } from "../middlewares/index.js";

const activityRouter = express.Router();

activityRouter.post(TALENTS_PULSE_CREATE_ACTIVITY, isMember, activityCreate);
activityRouter.get(TALENTS_PULSE_ACTIVITIES, isMember, getListActivities);
activityRouter.put(TALENTS_PULSE_UPDATE_ACTIVITY, isMember, activityUpdate);
activityRouter.delete(TALENTS_PULSE_DELETE_ACTIVITY, isMember, activityDelete);

export default activityRouter;
