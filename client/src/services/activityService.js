import axios from "axios";

import apiUrl from "../config/index.js";
import {
  TALENTS_PULSE_ACTIVITIES,
  TALENTS_PULSE_CREATE_ACTIVITY,
  TALENTS_PULSE_DELETE_ACTIVITY,
} from "../utils/apiUrlUtils.js";

export const activityCreate = async (activity, token) => {
  return await axios.post(
    `${apiUrl.API_URL}${TALENTS_PULSE_CREATE_ACTIVITY}`,
    activity,
    {
      headers: {
        token,
      },
    }
  );
};

export const getListActivities = async (activityType, token) => {
  return await axios.get(
    `${apiUrl.API_URL}${TALENTS_PULSE_ACTIVITIES}${activityType}`,
    {
      headers: {
        token,
      },
    }
  );
};

export const activityDelete = async (activityType, dctId, userId, token) => {
  return await axios.delete(
    `${apiUrl.API_URL}${TALENTS_PULSE_DELETE_ACTIVITY}${activityType}/${dctId}`,
    {
      headers: {
        token,
        userId,
      },
    }
  );
};
