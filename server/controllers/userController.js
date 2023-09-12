import jwt from "jsonwebtoken";
import config from "../config/index.js";
import User from "../models/userModel.js";
import slugify from "slugify";
import { DEFAULT_PASSWORD, STATUS_ACTIVE } from "../utils/constantsUtils.js";
import _ from "lodash";
import errorHandler from "../helpers/errorHandler.js";

export const getUserByToken = (req, res) => {
  const token = req.params.token;
  const user = jwt.decode(token);
  if (user != null) {
    const { _id } = user;
    jwt.verify(token, config.JWT_SECRET, (err) => {
      if (err) {
        return res.status(404).json({
          message: "Your token authentification is expired. Try relogin again.",
          user: null,
        });
      }
      User.findById(_id).exec((err, user) => {
        if (err || !user) {
          return res.status(404).json({ message: "User not found." });
        }
        return res.status(200).json({ user });
      });
    });
  } else {
    return res.status(404).json({ user: null });
  }
};

export const getListUsers = async (req, res) => {
  const listUsers = await User.find({}).sort({ createdAt: -1 });
  res.status(200).send({ listUsers });
};

export const userCreate = async (req, res) => {
  try {
    const {
      lastName,
      firstName,
      email,
      gender,
      country,
      dateOfBorn,
      phoneNumber,
      role,
    } = req.body;
    const user = await User.findOne({ email }).exec();
    if (user)
      return res.status(400).json({
        message: `User with email ${email} already existed. Try another one !!!`,
      });
    const member = new User({
      firstName,
      lastName,
      pseudo: lastName.split(" ")[0] + "." + firstName.split(" ")[0],
      slug: slugify(lastName),
      email,
      gender,
      country,
      dateOfBorn,
      password: DEFAULT_PASSWORD,
      phoneNumber,
      role,
    });

    member.save((err, user) => {
      if (err) {
        console.log(err);
        return res.status(401).json({
          error: "Error saving user in database. Try signup again",
        });
      } else {
        return res.status(201).json({
          message: "New memeber successfully added to system.",
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

export const userDelete = async (req, res) => {
  try {
    const user = await User.findOne({ slug: req.params.slug }).exec();
    if (user) {
      await user.remove();
      res.status(200).json({ message: "User deleted successfully." });
    } else {
      res.status(404).json({ message: "USer not found." });
    }
  } catch (error) {
    res.status(400).json({
      message: "Something wrong bad. Try again !!!",
    });
  }
};

export const userChangeRoleAndStatus = async (req, res) => {
  try {
    const { email } = req.body;
    let status = req.params.status;
    let role = req.params.role;
    let user = await User.findOne({ email }).exec();
    if (user) {
      const updatedFields = {
        role,
        status,
        emailVerified: status === STATUS_ACTIVE ? true : false,
      };

      user = _.extend(user, updatedFields);

      user.save((err, result) => {
        if (err) {
          return res.status(400).json({
            error: "Error updating role user",
          });
        }
        return res.status(200).json({
          user,
          message: `User permissions updated successfully.`,
        });
      });
    } else {
      res.status(404).json({ message: "User not found." });
    }
  } catch (error) {
    res.status(400).json({
      message: "Something wrong bad. Try again !!!",
    });
  }
};

export const userUpdate = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      gender,
      slug,
      country,
      phoneNumber,
      dateOfBorn,
      address,
    } = req.body;
    console.log(req.body);
    let user = await User.findOne({ slug }).exec();
    if (user) {
      const updatedFields = {
        firstName,
        lastName,
        pseudo: lastName.split(" ")[0] + "." + firstName.split(" ")[0],
        slug: slugify(lastName),
        email,
        gender,
        country,
        dateOfBorn,
        phoneNumber,
        address,
      };

      user = _.extend(user, updatedFields);

      // Generate new token and send to client
      const token = jwt.sign({ _id: user._id }, config.JWT_SECRET, {
        expiresIn: config.JWT_EXPIRED,
      });

      user.save((err, user) => {
        if (err) {
          console.log("Error: ", err);
          return res.status(401).json({
            message: `User ${firstName} ${lastName} already existed in our system.`,
          });
        } else {
          return res.status(200).json({
            token,
            message: "User informations updated successfully.",
            user,
          });
        }
      });
    } else {
      return res.status(404).json({
        error: "User to update not found",
      });
    }
  } catch (error) {
    res.status(400).json({
      message: errorHandler(error),
    });
  }
};

export const userUpdateAvatar = async (req, res) => {
  try {
    let user = await User.findOne({ slug: req.params.slug }).exec();
    if (user) {
      const updatedFields = {
        photoURL: req.body.data,
      };

      user = _.extend(user, updatedFields);

      user.save((err, result) => {
        if (err) {
          return res.status(400).json({
            error: "Error updating role user",
          });
        }
        return res.status(200).json({
          user,
          message: `User avatar updated successfully.`,
        });
      });
    } else {
      res.status(404).json({ message: "User not found." });
    }
  } catch (error) {
    res.status(400).json({
      message: "Something wrong bad. Try again !!!",
    });
  }
};
