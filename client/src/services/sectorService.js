import axios from "axios";
import apiUrl from "../config/index.js";
import {
  TALENTS_PULSE_ACTION_SECTOR,
  TALENTS_PULSE_CREATE_SECTOR,
  TALENTS_PULSE_DELETE_SECTOR,
  TALENTS_PULSE_SECTORS,
  TALENTS_PULSE_UPDATE_SECTOR,
} from "../utils/apiUrlUtils.js";
import { ACTION_ADD } from "../utils/constants.js";

export const sectorAdd = async (sector, token, action, slug) => {
  if (action === ACTION_ADD) {
    return await axios.post(
      `${apiUrl.API_URL}${TALENTS_PULSE_CREATE_SECTOR}`,
      sector,
      {
        headers: {
          token,
        },
      }
    );
  } else {
    return await axios.put(
      `${apiUrl.API_URL}${TALENTS_PULSE_UPDATE_SECTOR}${slug}`,
      sector,
      {
        headers: {
          token,
        },
      }
    );
  }
};

export const getListSectors = async () => {
  return await axios.get(`${apiUrl.API_URL}${TALENTS_PULSE_SECTORS}`);
};

export const sectorDelete = async (slug, token) => {
  return await axios.delete(`${apiUrl.API_URL}${TALENTS_PULSE_DELETE_SECTOR}${slug}`, {
    headers: {
      token,
    },
  });
};

export const sectorEnableOrDisable = async (slug, token) => {
  return await axios.put(
    `${apiUrl.API_URL}${TALENTS_PULSE_ACTION_SECTOR}${slug}`,
    {},
    {
      headers: {
        token,
      },
    }
  );
};
