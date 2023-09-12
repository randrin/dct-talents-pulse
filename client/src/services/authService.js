import axios from "axios";

import apiUrl from "../config/index.js";
import {
  END_POINT_VERIFY_ACCOUNT,
  END_POINT_CURRENT_USER,
  END_POINT_CURRENT_ADMIN,
} from "../routers/end-points.js";
import {
  TALENTS_PULSE_CHANGE_PASSWORD,
  TALENTS_PULSE_FIND_BY_EMAIL,
  TALENTS_PULSE_FORGOT_PASSWORD,
  TALENTS_PULSE_LOGIN,
  TALENTS_PULSE_REGISTER,
} from "../utils/apiUrlUtils.js";

export const userAuthenticated = async (user) => {
  return await axios.post(`${apiUrl.API_URL}${TALENTS_PULSE_LOGIN}`, user);
};

export const candidateRegistration = async (candidate) => {
  return await axios.post(`${apiUrl.API_URL}${TALENTS_PULSE_REGISTER}`, {
    candidate,
  });
};

export const userFindByEmail = async (email) => {
  return await axios.post(`${apiUrl.API_URL}${TALENTS_PULSE_FIND_BY_EMAIL}`, email);
};

export const userForgotPassword = async (user) => {
  return await axios.post(`${apiUrl.API_URL}${TALENTS_PULSE_FORGOT_PASSWORD}`, user);
};

export const userChangePassword = async (password, token) => {
  return await axios.post(`${apiUrl.API_URL}${TALENTS_PULSE_CHANGE_PASSWORD}`, {password, token});
};

export const userRegistrationComplete = async (userRegistered, token) => {
  return await axios.post(
    `${apiUrl.API_URL}${END_POINT_VERIFY_ACCOUNT}`,
    { userRegistered },
    {
      headers: {
        token,
      },
    }
  );
};

export const userLogged = async (token) => {
  return await axios.post(
    `${apiUrl.API_URL}${END_POINT_CURRENT_USER}`,
    {},
    {
      headers: {
        token,
      },
    }
  );
};

export const adminLogged = async (token) => {
  return await axios.post(
    `${apiUrl.API_URL}${END_POINT_CURRENT_ADMIN}`,
    {},
    {
      headers: {
        token,
      },
    }
  );
};
