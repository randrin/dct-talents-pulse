import axios from "axios";
import apiUrl from "../config/index.js";
import {
  TALENTS_PULSE_REMOVE_IMAGE,
  TALENTS_PULSE_UPLOAD_IMAGES,
} from "../utils/apiUrlUtils.js";

export const getListCountriesFlags = async () => {
  return await axios.get(
    `https://countriesnow.space/api/v0.1/countries/flag/images`
  );
};

export const uploadImages = async (uri, token) => {
  return await axios.post(
    `${apiUrl.API_URL}${TALENTS_PULSE_UPLOAD_IMAGES}`,
    { image: uri },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
        token,
      },
    }
  );
};

export const removeImage = async (public_id, token) => {
  return await axios.post(
    `${apiUrl.API_URL}${TALENTS_PULSE_REMOVE_IMAGE}`,
    { public_id },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
        token,
      },
    }
  );
};
