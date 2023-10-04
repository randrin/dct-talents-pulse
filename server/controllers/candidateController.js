import slugify from "slugify";
import jwt from "jsonwebtoken";
import _ from "lodash";
import config from "../config/index.js";
import User from "../models/userModel.js";
import { STATUS_DISABLED, STATUS_SUSPENDED } from "../utils/constantsUtils.js";

export const userRegister = async (req, res) => {
  try {
    const {
      lastName,
      firstName,
      email,
      password,
      gender,
      country,
      dateOfBorn,
    } = req.body.candidate;
    const user = await User.findOne({ email }).exec();

    if (user) {
      return res.status(400).json({
        message: `Candidate with email ${email} already existed. Try another one !!!`,
      });
    }

    const candidate = new User({
      firstName: firstName.charAt(0).toUpperCase() + firstName.slice(1),
      lastName: lastName.charAt(0).toUpperCase() + lastName.slice(1),
      pseudo: lastName.split(" ")[0] + "." + firstName.split(" ")[0],
      slug: slugify(lastName),
      email,
      gender,
      country,
      dateOfBorn,
      password,
    });

    candidate.save((err, user) => {
      console.log("err: ", err);
      if (err) {
        return res.status(401).json({
          error: "Error saving user in database. Try signup again",
        });
      } else {
        return res.status(201).json({
          message: "Signup success. Please signin.",
          user,
        });
      }
    });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Something wrong bad. Try again !!!" });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    await User.findOne({ email }).exec((err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: "User with that email does not exist. Please signup",
        });
      }
      // authenticate
      if (!user.authentificate(password)) {
        return res.status(400).json({
          message: "Email and password do not match",
        });
      }
      // generate a token and send to client
      const token = jwt.sign({ _id: user._id }, config.JWT_SECRET, {
        expiresIn: config.JWT_EXPIRED,
      });

      console.log(user);
      if (user.status === STATUS_DISABLED || user.status === STATUS_SUSPENDED) {
        return res.status(401).json({
          message: "Your account isn't valid or disabled. Contact your Talents Pulse Administration for more information. Thanks you.",
        });
      }

      return res.status(200).json({
        token,
        user,
      });
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something wrong bad. Try again !!!" });
  }
};

export const userFindByEmail = async (req, res) => {
  try {
    const { email } = req.body;

    await User.findOne({ email }).exec((err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: "User with that email does not exist. Please signup",
        });
      }
      return res.status(200).json({
        user,
      });
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something wrong bad. Try again !!!" });
  }
};

export const userChangePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body.password;
    const token = req.body.token;
    if (token) {
      jwt.verify(token, config.JWT_SECRET, async function (err, decoded) {
        if (err) {
          return res.status(401).json({
            error: "Expired link or link malformed. Signup again to continue.",
          });
        }

        const { _id } = jwt.decode(token);

        let user = await User.findById({ _id }).exec();

        // Verify Encrypt Password
        if (user.encryptPassword(currentPassword) !== user.hashed_password) {
          return res.status(400).json({
            message: "Current password isn't correct. Try again !!!",
          });
        }

        const updatedFields = {
          password: newPassword,
        };

        user = _.extend(user, updatedFields);

        user.save((err, result) => {
          if (err) {
            return res.status(400).json({
              error: "Error updating user password",
            });
          }
          return res.status(200).json({
            user,
            message: `Great! Now you can login with your new password`,
          });
        });
      });
    } else {
      return res.status(500).json({
        message: "Something went wrong. Try again.",
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something wrong bad. Try again !!!" });
  }
};

export const userForgotPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    await User.findOne({ email }).exec((err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: "User with that email does not exist. Please signup",
        });
      }

      const updatedFields = {
        password,
      };

      user = _.extend(user, updatedFields);

      user.save((err, result) => {
        if (err) {
          return res.status(400).json({
            error: "Error resetting user password",
          });
        }
        return res.status(200).json({
          user,
          message: `Great! Now you can login with your new password`,
        });
      });
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something wrong bad. Try again !!!" });
  }
};
