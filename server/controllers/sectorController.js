import slugify from "slugify";
import Sector from "../models/sectorModel.js";
import User from "../models/userModel.js";
import config from "../config/index.js";
import jwt from "jsonwebtoken";
import _ from "lodash";
import {
  ACTION_MODE_ACTIVE,
  ACTION_MODE_DISABLED,
} from "../utils/constantsUtils.js";

export const sectorCreate = async (req, res) => {
  try {
    const { name, code, colorRgb } = req.body;
    const token = req.headers.token;

    if (token) {
      jwt.verify(token, config.JWT_SECRET, async function (err, decoded) {
        if (err) {
          return res.status(401).json({
            error: "Expired link or link malformed. Signup again to continue.",
          });
        }
        const { _id } = jwt.decode(token);

        let user = await User.findById({ _id }).exec();
        const sector = new Sector({
          code: code.toLocaleUpperCase(),
          name,
          colorRgb,
          slug: slugify(name),
          postedBy: user._id,
        });

        sector.save((err, user) => {
          if (err) {
            return res.status(400).json({
              error: `Code ${code.toLocaleUpperCase()} and/or sector ${name} already exist. Try anothe one.`,
            });
          } else {
            return res.status(201).json({
              message: "Sector created successfully.",
              sector,
            });
          }
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

export const getListSectors = async (req, res) => {
  const listSectors = await Sector.find({})
    .sort({ createdAt: -1 })
    .populate("postedBy");
  res.status(200).send({ listSectors });
};

export const getSectorBySlug = async (req, res) => {};

export const sectorUpdate = async (req, res) => {
  try {
    const { name, code, colorRgb } = req.body;
    const token = req.headers.token;
    if (token) {
      jwt.verify(token, config.JWT_SECRET, async function (err, decoded) {
        if (err) {
          return res.status(401).json({
            error: "Expired link or link malformed. Signup again to continue.",
          });
        }
        let sector = await Sector.findOne({ slug: req.params.slug }).exec();
        const { _id } = jwt.decode(token);

        let user = await User.findById({ _id }).exec();

        const updatedFields = {
          code: code.toLocaleUpperCase(),
          name,
          colorRgb,
          slug: slugify(name),
          postedBy: user._id,
        };

        sector = _.extend(sector, updatedFields);

        sector.save((err, result) => {
          if (err) {
            console.log(err);
            return res.status(400).json({
              error: `Code ${code.toLocaleUpperCase()} and/or sector ${name} already exist. Try anothe one.`,
            });
          }
          return res.status(200).json({
            sector,
            message: `Sector updated successfully.`,
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

export const sectorEnableOrDisable = async (req, res) => {
  try {
    const token = req.headers.token;
    if (token) {
      jwt.verify(token, config.JWT_SECRET, async function (err, decoded) {
        if (err) {
          return res.status(401).json({
            error: "Expired link or link malformed. Signup again to continue.",
          });
        }
        let sector = await Sector.findOne({ slug: req.params.slug }).exec();
        const { _id } = jwt.decode(token);

        let user = await User.findById({ _id }).exec();

        const updatedFields = {
          status:
            sector.status === ACTION_MODE_ACTIVE
              ? ACTION_MODE_DISABLED
              : ACTION_MODE_ACTIVE,
          postedBy: user._id,
        };

        sector = _.extend(sector, updatedFields);

        sector.save((err, result) => {
          if (err) {
            return res.status(400).json({
              error: "Error updating sector",
            });
          }
          return res.status(200).json({
            sector,
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

export const sectorDelete = async (req, res) => {
  try {
    const sector = await Sector.findOne({ slug: req.params.slug }).exec();
    if (sector) {
      await sector.remove();
      res.status(200).json({ message: "Sector deleted successfully." });
    } else {
      res.status(404).json({ message: "Sector not found." });
    }
  } catch (error) {
    res.status(400).json({
      message: "Something wrong bad. Try again !!!",
    });
  }
};
