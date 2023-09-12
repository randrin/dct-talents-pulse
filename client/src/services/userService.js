import axios from "axios";
import {
  TALENTS_PULSE_CHANGE_ROLE_USER,
  TALENTS_PULSE_CREATE_USER,
  TALENTS_PULSE_CURRENT_USER,
  TALENTS_PULSE_DELETE_USER,
  TALENTS_PULSE_UPDATE_USER,
  TALENTS_PULSE_UPLOAD_AVATAR_USER,
  TALENTS_PULSE_USERS,
} from "../utils/apiUrlUtils.js";
import apiUrl from "../config/index.js";

export const userByToken = async (token) => {
  return await axios.get(`${apiUrl.API_URL}${TALENTS_PULSE_CURRENT_USER}${token}`, {
    token,
  });
};

export const getListUsers = async (token) => {
  return await axios.get(`${apiUrl.API_URL}${TALENTS_PULSE_USERS}`, {
    headers: {
      token,
    },
  });
};

export const addNewMember = async (user, token) => {
  return await axios.post(`${apiUrl.API_URL}${TALENTS_PULSE_CREATE_USER}`, user, {
    headers: {
      token,
    },
  });
};

export const userDelete = async (slug, token) => {
  return await axios.delete(`${apiUrl.API_URL}${TALENTS_PULSE_DELETE_USER}${slug}`, {
    headers: {
      token,
    },
  });
};

export const changeRoleAndStatusMember = async (user, role, status, token) => {
  return await axios.put(
    `${apiUrl.API_URL}${TALENTS_PULSE_CHANGE_ROLE_USER}${role}/${status}`,
    user,
    {
      headers: {
        token,
      },
    }
  );
};

export const userUpdate = async (user, token) => {
  return await axios.put(
    `${apiUrl.API_URL}${TALENTS_PULSE_UPDATE_USER}${user.slug}`,
    user,
    {
      headers: {
        token,
      },
    }
  );
};

export const userUpdateAvatar = async (user, data, token) => {
  return await axios.put(
    `${apiUrl.API_URL}${TALENTS_PULSE_UPLOAD_AVATAR_USER}${user.slug}`,
    data,
    {
      headers: {
        token,
      },
    }
  );
};
