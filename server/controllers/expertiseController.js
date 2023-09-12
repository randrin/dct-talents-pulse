import slugify from "slugify";
import config from "../config/index.js";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import Expertise from "../models/expertiseModel.js";
import _ from "lodash";
import {
  ACTION_MODE_ACTIVE,
  ACTION_MODE_DISABLED,
} from "../utils/constantsUtils.js";

export const expertiseCreate = async (req, res) => {
  try {
    const { name, colorRgb, parent } = req.body;
    const token = req.headers.token;

    if (token) {
      jwt.verify(token, config.JWT_SECRET, async function (err, decoded) {
        if (err) {
          return res.status(401).json({
            error: "Expired link or link malformed. Signup again to continue.",
          });
        }

        const { _id } = jwt.decode(token);

        let expertise = await Expertise.findOne({
          slug: slugify(name.toLocaleLowerCase()),
          parent,
        }).exec();
        if (expertise) {
          return res.status(400).json({
            error: `Expertise ${name} already exist with the sector. Try anothe one.`,
          });
        } else {
          let user = await User.findById({ _id }).exec();
          const expertiseToSave = new Expertise({
            name,
            colorRgb,
            parent,
            slug: slugify(name),
            postedBy: user._id,
          });
          expertiseToSave.save((err, user) => {
            console.log("error: ", err);
            if (err) {
              return res.status(400).json({
                error: `Error saving expertise. Try again.`,
              });
            } else {
              return res.status(201).json({
                message: "Expertise created successfully.",
              });
            }
          });
        }
      });
    } else {
      return res.status(500).json({
        message: "Something went wrong. Try again.",
      });
    }
  } catch (error) {
    res.status(400).json({
      message: "Something wrong bad. Try again !!!",
    });
  }
};

export const getListExpertises = async (req, res) => {
  const listExpertises = await Expertise.find({})
    .sort({ createdAt: -1 })
    .populate("parent")
    .populate("postedBy");
  res.status(200).send({ listExpertises });
};

export const getExpertisesBySector = async (req, res) => {
  const listExpertises = await Expertise.find({ parent: req.params.sector })
    .sort({ createdAt: -1 })
    .populate("parent")
    .populate("postedBy");
  res.status(200).send({ listExpertises });
};

export const getExpertisesById = async (req, res) => {
  const expertise = await Expertise.find({ _id: req.params.expertiseId })
    .sort({ createdAt: -1 })
    .populate("parent")
    .populate("postedBy");
  res.status(200).send({ expertise });
};

export const expertiseUpdate = async (req, res) => {
  try {
    const { name, colorRgb, parent } = req.body;
    const token = req.headers.token;
    if (token) {
      jwt.verify(token, config.JWT_SECRET, async function (err, decoded) {
        if (err) {
          return res.status(401).json({
            error: "Expired link or link malformed. Signup again to continue.",
          });
        }

        let expertise = await Expertise.findOne({
          slug: slugify(name.toLocaleLowerCase()),
          parent,
        }).exec();
        if (expertise) {
          // In this cas, the same expertise to save without changing anything in client side
          expertise = _.extend(expertise, { colorRgb });
          await expertise.save();
          return res.status(200).json({
            expertise,
            message: `Expertise updated successfully.`,
          });
        } else {
          let expertiseToUpd = await Expertise.findOne({
            slug: req.params.slug,
          }).exec();
          const { _id } = jwt.decode(token);

          let user = await User.findById({ _id }).exec();

          const updatedFields = {
            name,
            colorRgb,
            parent,
            slug: slugify(name),
            postedBy: user._id,
          };

          expertiseToUpd = _.extend(expertiseToUpd, updatedFields);

          expertiseToUpd.save((err, result) => {
            if (err) {
              return res.status(400).json({
                error: `Expertise ${name} already exist with the sector. Try anothe one.`,
              });
            }
            return res.status(200).json({
              expertise,
              message: `Expertise updated successfully.`,
            });
          });
        }
      });
    } else {
      return res.status(500).json({
        message: "Something went wrong. Try again.",
      });
    }
  } catch (error) {
    res.status(400).json({
      message: "Something wrong bad. Try again !!!",
    });
  }
};

export const expertiseEnableOrDisable = async (req, res) => {
  try {
    const token = req.headers.token;
    if (token) {
      jwt.verify(token, config.JWT_SECRET, async function (err, decoded) {
        if (err) {
          return res.status(401).json({
            error: "Expired link or link malformed. Signup again to continue.",
          });
        }
        let expertise = await Expertise.findOne({
          slug: req.params.slug,
        }).exec();
        const { _id } = jwt.decode(token);

        let user = await User.findById({ _id }).exec();

        const updatedFields = {
          status:
            expertise.status === ACTION_MODE_ACTIVE
              ? ACTION_MODE_DISABLED
              : ACTION_MODE_ACTIVE,
          postedBy: user._id,
        };

        expertise = _.extend(expertise, updatedFields);

        expertise.save((err, result) => {
          if (err) {
            return res.status(400).json({
              error: "Error updating expertise",
            });
          }
          return res.status(200).json({
            expertise,
            message: `Sector status updated successfully.`,
          });
        });
      });
    } else {
      return res.status(500).json({
        message: "Something went wrong. Try again.",
      });
    }
  } catch (error) {
    res.status(400).json({
      message: "Something wrong bad. Try again !!!",
    });
  }
};

export const expertiseDelete = async (req, res) => {
  try {
    const expertise = await Expertise.findOne({ slug: req.params.slug }).exec();
    if (expertise) {
      await expertise.remove();
      res.status(200).json({ message: "Expertise deleted successfully." });
    } else {
      res.status(404).json({ message: "Expertise not found." });
    }
  } catch (error) {
    res.status(400).json({
      message: "Something wrong bad. Try again !!!",
    });
  }
};
