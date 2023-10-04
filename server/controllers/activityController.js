import slugify from "slugify";
import jwt from "jsonwebtoken";
import _ from "lodash";
import config from "../config/index.js";
import Sector from "../models/sectorModel.js";
import Expertise from "../models/expertiseModel.js";
import User from "../models/userModel.js";
import Dct from "../models/dctModel.js";
import Activity from "../models/activityModel.js";
import {
  ACTIVITY_CREATE_DCT,
  DEFAULT_PASSWORD,
  STATUS_ACTIVE,
} from "../utils/constantsUtils.js";

export const activityCreate = async (req, res) => {
  try {
    console.log(req.body);

    const {
      firstName,
      lastName,
      sector,
      profession,
      professionUser,
      expNumber,
      nationality,
      email,
      country,
      dateOfBorn,
      gender,
    } = req.body;
    const token = req.headers.token;

    if (token) {
      jwt.verify(token, config.JWT_SECRET, async function (err, decoded) {
        if (err) {
          return res.status(401).json({
            error: "Expired link or link malformed. Signup again to continue.",
          });
        }

        // First, register the candidate
        const candidate = new User({
          firstName,
          lastName,
          pseudo: lastName.split(" ")[0] + "." + firstName.split(" ")[0],
          slug: slugify(lastName),
          email,
          gender,
          country,
          dateOfBorn,
          password: DEFAULT_PASSWORD,
          emailVerified: true,
          status: STATUS_ACTIVE,
        });
        let userDct = await candidate.save();
        console.log(userDct);

        // Second, save the DCT
        let sectorDct = await Sector.findById({
          _id: sector,
        }).exec();

        let expertiseDct;
        if(!!profession.length) {
          expertiseDct = await Expertise.findById({
            _id: profession,
          }).exec();
        }

        const { _id } = jwt.decode(token);

        let user = await User.findById({ _id }).exec();
        const dct = new Dct({
          sector: sectorDct,
          expertiseUser: professionUser,
          expertise: expertiseDct,
          expNumber,
          nationality,
          user: userDct._id,
        });
        await dct.save();

        // Third, save the activity
        const activity = new Activity({
          activityType: ACTIVITY_CREATE_DCT,
          dct,
          user: user._id,
        });

        activity.save(async (err, result) => {
          console.log(err);
          if (err) {
            return res.status(400).json({
              error: "Error creating activity",
            });
          }

          return res.status(201).json({
            activity,
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

export const getListActivities = async (req, res) => {
  try {
    const token = req.headers.token;
    if (token) {
      jwt.verify(token, config.JWT_SECRET, async function (err, decoded) {
        if (err) {
          return res.status(401).json({
            error: "Expired link or link malformed. Signup again to continue.",
          });
        }
        const activityType = req.params.activityType;
        const { _id } = jwt.decode(token);
        const listActivities = await Activity.find({
          activityType,
          user: _id,
        })
          .sort({
            createdAt: -1,
          })
          .populate({
            path: "dct",
            populate: {
              path: "user expertise",
            },
          });
        res.status(200).send({ listActivities });
      });
    }
  } catch (error) {
    res.status(400).json({
      message: "Something wrong bad. Try again !!!",
    });
  }
};

export const activityUpdate = async (req, res) => {};

export const activityDelete = async (req, res) => {
  const userId = req.headers.userid;
  const dctId = req.params.dctId;
  const type = req.params.activityType;
  try {
    const activity = await Activity.findOne({
      activityType: type,
      dct: dctId,
    }).exec();
    if (activity) {
      const userDct = await User.findOne({
        _id: userId,
      }).exec();
      const dctUser = await Dct.findOne({
        _id: dctId,
      }).exec();
      if (dctUser) {
        await dctUser.remove();
      }
      if (userDct) {
        await userDct.remove();
      }
      await activity.remove();
      res.status(200).json({ message: "Activity deleted successfully." });
    } else {
      res.status(404).json({ message: "Activity not found." });
    }
  } catch (error) {
    res.status(400).json({
      message: "Something wrong bad. Try again !!!",
    });
  }
};
