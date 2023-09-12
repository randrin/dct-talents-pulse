import { expressjwt } from "express-jwt";
import User from "../models/userModel.js";
import { ROLE_ADMIN, ROLE_MEMBER } from "../utils/constantsUtils.js";
import config from "../config/index.js";
import jwt from "jsonwebtoken";

// export const isAuthenticated = expressjwt({
//   secret: config.JWT_SECRET,
//   algorithms: ["HS256"],
// });

export const isAuthenticated = async (req, res, next) => {
  let token = req.headers.token;

  if (token) {
    jwt.verify(token, config.JWT_SECRET, async function (err, decoded) {
      if (err) {
        return res.status(401).json({
          error: "Expired link or link malformed. Signup again to continue.",
        });
      }
      next();
    });
  } else {
    res.status(401).json({
      error: "Authentification not provided. Signup again to continue.",
    });
  }
};

export const isAdmin = async (req, res, next) => {
  let token = req.headers.token;

  if (token) {
    jwt.verify(token, config.JWT_SECRET, async function (err, decoded) {
      if (err) {
        return res.status(401).json({
          error: "Expired link or link malformed. Signup again to continue.",
        });
      }
      const { _id } = jwt.decode(token);

      let user = await User.findById({ _id }).exec();
      if (user.role === ROLE_ADMIN) {
        next();
      } else {
        res.status(403).json({
          error: "Admin resource. Access denied.",
        });
      }
    });
  } else {
    res.status(403).json({
      error: "Admin resource. Access denied.",
    });
  }
};

export const isMember = async (req, res, next) => {
  let token = req.headers.token;

  if (token) {
    jwt.verify(token, config.JWT_SECRET, async function (err, decoded) {
      if (err) {
        return res.status(401).json({
          error: "Expired link or link malformed. Signup again to continue.",
        });
      }
      const { _id } = jwt.decode(token);

      let user = await User.findById({ _id }).exec();
      if (user.role === ROLE_MEMBER || user.role === ROLE_ADMIN) {
        next();
      } else {
        res.status(403).json({
          error: "Admin resource. Access denied.",
        });
      }
    });
  } else {
    res.status(403).json({
      error: "Admin resource. Access denied.",
    });
  }
};
