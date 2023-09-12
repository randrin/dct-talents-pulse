import axios from "axios";

import apiUrl from "../config/index.js";
import {
  TALENTS_PULSE_CREATE_DCT,
  TALENTS_PULSE_DCTS,
  TALENTS_PULSE_DCT_FIND_BY_ID,
  TALENTS_PULSE_DCT_FIND_BY_TOKEN,
  TALENTS_PULSE_DELETE_DCT,
  TALENTS_PULSE_DOWNLOAD_DCT,
  TALENTS_PULSE_FILTER_DCTS,
  TALENTS_PULSE_UPDATE_DCT,
  TALENTS_PULSE_UPDATE_MATRICULE_DCT,
} from "../utils/apiUrlUtils.js";

export const dctCreate = async (dct, token) => {
  return await axios.post(`${apiUrl.API_URL}${TALENTS_PULSE_CREATE_DCT}`, dct, {
    headers: {
      token,
    },
  });
};

export const dctUpdate = async (dct, type, token) => {
  return await axios.put(`${apiUrl.API_URL}${TALENTS_PULSE_UPDATE_DCT}${type}`, dct, {
    headers: {
      token,
    },
  });
};

export const dctUpdateMatricule = async (dctId, matricule, token) => {
  return await axios.put(
    `${apiUrl.API_URL}${TALENTS_PULSE_UPDATE_MATRICULE_DCT}${dctId}`,
    { matricule },
    {
      headers: {
        token,
      },
    }
  );
};

export const dctDownload = async (dctId, token) => {
  return await axios.post(`${apiUrl.API_URL}${TALENTS_PULSE_DOWNLOAD_DCT}${dctId}`, {}, {
    headers: {
      token,
    },
  });
};

export const getListDcts = async (token) => {
  return await axios.get(`${apiUrl.API_URL}${TALENTS_PULSE_DCTS}`, {
    headers: {
      token,
    },
  });
};

export const dctsFilter = async (filter, token) => {
  return await axios.post(`${apiUrl.API_URL}${TALENTS_PULSE_FILTER_DCTS}`, filter, {
    headers: {
      token,
    },
  });
};

export const getDctById = async (id, token) => {
  return await axios.get(`${apiUrl.API_URL}${TALENTS_PULSE_DCT_FIND_BY_ID}${id}`, {
    headers: {
      token,
    },
  });
};

export const getDctByUser = async (token) => {
  return await axios.get(`${apiUrl.API_URL}${TALENTS_PULSE_DCT_FIND_BY_TOKEN}`, {
    headers: {
      token,
    },
  });
};

export const dctDelete = async (dctId, token) => {
  return await axios.delete(`${apiUrl.API_URL}${TALENTS_PULSE_DELETE_DCT}${dctId}`, {
    headers: {
      token,
    },
  });
};