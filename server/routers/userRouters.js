import express from "express";
import { isAdmin, isAuthenticated, isMember } from "../middlewares/index.js";
import {
  getListUsers,
  getUserByToken,
  userCreate,
  userDelete,
  userChangeRoleAndStatus,
  userUpdate,
  userUpdateAvatar
} from "../controllers/userController.js";
import {
  TALENTS_PULSE_CHANGE_ROLE_USER,
  TALENTS_PULSE_CREATE_USER,
  TALENTS_PULSE_CURRENT_USER,
  TALENTS_PULSE_DELETE_USER,
  TALENTS_PULSE_UPDATE_USER,
  TALENTS_PULSE_UPLOAD_AVATAR_USER,
  TALENTS_PULSE_USERS,
} from "../utils/apiUrlUtils.js";
//import { isAuthenticated } from "../middlewares";

const userRouter = express.Router();

userRouter.get(TALENTS_PULSE_CURRENT_USER, getUserByToken);
userRouter.get(TALENTS_PULSE_USERS, isMember, getListUsers);
userRouter.post(TALENTS_PULSE_CREATE_USER, isAdmin, userCreate);
userRouter.delete(TALENTS_PULSE_DELETE_USER, isAdmin, userDelete);
userRouter.put(TALENTS_PULSE_UPDATE_USER, isAuthenticated, userUpdate);
userRouter.put(TALENTS_PULSE_CHANGE_ROLE_USER, isAdmin, userChangeRoleAndStatus);
userRouter.put(TALENTS_PULSE_UPLOAD_AVATAR_USER, isAuthenticated, userUpdateAvatar);
//userRouter.get("/current-user/slug=:slug", isAuthenticated, getUserBySlug);
// userRouter.post('/account-activation', userAccountActivation);
// userRouter.post("/login", userLogin);

export default userRouter;
