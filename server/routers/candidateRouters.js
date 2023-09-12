import express from "express";
//import { runValidation } from "../validators";
//import { userSignupValidator } from "../validators/auth";
import {
  TALENTS_PULSE_CHANGE_PASSWORD,
  TALENTS_PULSE_FIND_BY_EMAIL,
  TALENTS_PULSE_FORGOT_PASSWORD,
  TALENTS_PULSE_LOGIN,
  TALENTS_PULSE_REGISTER,
} from "../utils/apiUrlUtils.js";
import {
  userFindByEmail,
  userForgotPassword,
  userChangePassword,
  userLogin,
  userRegister,
} from "../controllers/candidateController.js";
//import { getUserBySlug, getUserByToken } from "../controllers/userController";
//import { isAuthenticated } from "../middlewares";

const candidateRouter = express.Router();

candidateRouter.post(TALENTS_PULSE_REGISTER, userRegister);
candidateRouter.post(TALENTS_PULSE_LOGIN, userLogin);
candidateRouter.post(TALENTS_PULSE_FIND_BY_EMAIL, userFindByEmail);
candidateRouter.post(TALENTS_PULSE_FORGOT_PASSWORD, userForgotPassword);
candidateRouter.post(TALENTS_PULSE_CHANGE_PASSWORD, userChangePassword);
// userRouter.post('/account-activation', userAccountActivation);
// userRouter.post("/login", userLogin);

export default candidateRouter;
