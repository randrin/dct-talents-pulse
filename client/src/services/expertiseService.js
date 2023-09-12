import axios from "axios";
import apiUrl from "../config/index.js";
import {
  TALENTS_PULSE_ACTION_EXPERTISE,
  TALENTS_PULSE_CREATE_EXPERTISE,
  TALENTS_PULSE_DELETE_EXPERTISE,
  TALENTS_PULSE_EXPERTISES,
  TALENTS_PULSE_EXPERTISES_FIND_BY_SECTOR,
  TALENTS_PULSE_EXPERTISE_FIND_BY_ID,
  TALENTS_PULSE_UPDATE_EXPERTISE,
} from "../utils/apiUrlUtils.js";
import { ACTION_ADD } from "../utils/constants.js";

export const expertiseAdd = async (expertise, token, action, slug) => {
  if (action === ACTION_ADD) {
    return await axios.post(
      `${apiUrl.API_URL}${TALENTS_PULSE_CREATE_EXPERTISE}`,
      expertise,
      {
        headers: {
          token,
        },
      }
    );
  } else {
    return await axios.put(
      `${apiUrl.API_URL}${TALENTS_PULSE_UPDATE_EXPERTISE}${slug}`,
      expertise,
      {
        headers: {
          token,
        },
      }
    );
  }
};

export const getListExpertises = async () => {
  return await axios.get(`${apiUrl.API_URL}${TALENTS_PULSE_EXPERTISES}`);
};

export const findExpertiseById = async (expertiseId) => {
  return await axios.get(`${apiUrl.API_URL}${TALENTS_PULSE_EXPERTISE_FIND_BY_ID}${expertiseId}`);
};

export const getListExpertisesBySector = async (sector) => {
  return await axios.get(`${apiUrl.API_URL}${TALENTS_PULSE_EXPERTISES_FIND_BY_SECTOR}${sector}`);
};

export const expertiseDelete = async (slug, token) => {
  return await axios.delete(`${apiUrl.API_URL}${TALENTS_PULSE_DELETE_EXPERTISE}${slug}`, {
    headers: {
      token,
    },
  });
};

export const expertiseEnableOrDisable = async (slug, token) => {
  return await axios.put(
    `${apiUrl.API_URL}${TALENTS_PULSE_ACTION_EXPERTISE}${slug}`,
    {},
    {
      headers: {
        token,
      },
    }
  );
};
