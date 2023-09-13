import Expertise from "../models/expertiseModel.js";
import _ from "lodash";
import Sector from "../models/sectorModel.js";
import User from "../models/userModel.js";
import Dct from "../models/dctModel.js";
import jwt from "jsonwebtoken";
import config from "../config/index.js";
import {
  ACTIVITY_CREATE_DCT,
  DCT_ACTION_DESCRIPTION,
  DCT_ACTION_DESCRIPTION_SALARY,
  DCT_ACTION_FORMATIONS,
  DCT_ACTION_LINGUISTICS,
  DCT_ACTION_PROJECTS,
  DCT_ACTION_PROJECTS_DETAIL,
  DCT_ACTION_SALARY,
  DCT_ACTION_SKILLS,
  DCT_ACTION_TECNICAL_SKILLS,
  MONTH,
  STATUS_ACTIVE,
} from "../utils/constantsUtils.js";
import fs from "fs";
import { TemplateHandler } from "easy-template-x";
import Activity from "../models/activityModel.js";
import { talentsPulseExtractDateToMonth } from "../utils/index.js";
const templateFile = fs.readFileSync("dct-template.docx");

export const dctCreate = async (req, res) => {
  try {
    const { sector, expertise, expNumber, nationality } = req.body;
    const token = req.headers.token;

    if (token) {
      jwt.verify(token, config.JWT_SECRET, async function (err, decoded) {
        if (err) {
          return res.status(401).json({
            error: "Expired link or link malformed. Signup again to continue.",
          });
        }

        let sectorDct = await Sector.findById({
          _id: sector,
        }).exec();

        let expertiseDct = await Expertise.findById({
          _id: expertise,
        }).exec();

        const { _id } = jwt.decode(token);

        let user = await User.findById({ _id }).exec();

        const dct = new Dct({
          sector: sectorDct,
          expertise: expertiseDct,
          expNumber,
          nationality,
          user: user._id,
        });

        dct.save(async (err, result) => {
          console.log(err);
          if (err) {
            return res.status(400).json({
              error: "Error creating dct",
            });
          }
          // Update the emailVerified, status Fields
          // Field to check if the user are completed the first registration
          const updatedFields = {
            emailVerified: true,
            status: STATUS_ACTIVE,
          };

          user = _.extend(user, updatedFields);
          await user.save();
          return res.status(201).json({
            user,
            token,
            message: `Your DCT are been created successfully on our database.`,
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

export const getListDcts = async (req, res) => {
  const listDcts = await Dct.find({})
    .sort({ createdAt: -1 })
    .populate("sector")
    .populate({
      path: "expertise",
      populate: {
        path: "parent postedBy",
      },
    })
    .populate("user");
  res.status(200).send({ listDcts });
};

export const dctsFilter = async (req, res) => {
  console.log(req.body);
  const { sector, matricule } = req.body;
  const sectorFilter = sector ? sector : { $exists: true };
  const matriculeFilter =
    matricule === "OK"
      ? { $ne: "" }
      : matricule === "KO"
      ? ""
      : { $exists: true };
  const listDcts = await Dct.find({
    sector: sectorFilter,
    matricule: matriculeFilter,
  })
    .sort({ createdAt: -1 })
    .populate("sector")
    .populate("expertise")
    .populate("user");
  res.status(200).send({ listDcts });
};

export const getDctById = async (req, res) => {
  const dctId = req.params._id;
  const dct = await Dct.findOne({ _id: dctId })
    .populate("sector")
    .populate("expertise")
    .populate("user");
  if (dct) {
    res.status(200).send({ dct });
  } else {
    res.status(404).send({ message: `Dct not found with the id ${dctId}` });
  }
};

export const getDctByToken = async (req, res) => {
  try {
    const token = req.headers.token;
    if (token) {
      jwt.verify(token, config.JWT_SECRET, async function (err, decoded) {
        if (err) {
          return res.status(401).json({
            error: "Expired link or link malformed. Signup again to continue.",
          });
        }

        const { _id } = jwt.decode(token);
        const dct = await Dct.findOne({ user: _id })
          .populate("sector")
          .populate("expertise")
          .populate("user");
        if (dct) {
          res.status(200).send({ dct });
        } else {
          res.status(404).send({ message: `Dct not found` });
        }
      });
    }
  } catch (error) {
    res.status(400).json({
      message: "Something wrong bad. Try again !!!",
    });
  }
};

export const dctUpdate = async (req, res) => {
  try {
    const {
      dctId,
      description,
      salaryType,
      salaryRange,
      formations,
      projects,
      skills,
      projectsDetail,
      tecnicalSkills,
      linguistics,
    } = req.body;
    const token = req.headers.token;
    const type = req.params.type;

    if (token) {
      jwt.verify(token, config.JWT_SECRET, async function (err, decoded) {
        if (err) {
          return res.status(401).json({
            error: "Expired link or link malformed. Signup again to continue.",
          });
        }

        const { _id } = jwt.decode(token);

        let dct;
        if (dctId) {
          dct = await Dct.findOne({ _id: dctId });
        } else {
          dct = await Dct.findOne({ user: _id });
        }

        let updatedFields;

        if (type === DCT_ACTION_DESCRIPTION) {
          updatedFields = {
            description,
          };
        }

        if (type === DCT_ACTION_SALARY) {
          updatedFields = {
            salaryType,
            salaryRange,
          };
        }

        if (type === DCT_ACTION_DESCRIPTION_SALARY) {
          updatedFields = {
            description,
            salaryType,
            salaryRange,
          };
        }

        if (type === DCT_ACTION_SKILLS) {
          updatedFields = {
            skills,
          };
        }

        if (type === DCT_ACTION_PROJECTS) {
          updatedFields = {
            projects,
          };
        }

        if (type === DCT_ACTION_PROJECTS_DETAIL) {
          updatedFields = {
            projectsDetail,
          };
        }

        if (type === DCT_ACTION_FORMATIONS) {
          updatedFields = {
            formations,
          };
        }

        if (type === DCT_ACTION_TECNICAL_SKILLS) {
          updatedFields = {
            tecnicalSkills,
          };
        }

        if (type === DCT_ACTION_LINGUISTICS) {
          updatedFields = {
            linguistics,
          };
        }

        dct = _.extend(dct, updatedFields);

        dct.save(async (err, result) => {
          console.log(err);
          if (err) {
            return res.status(400).json({
              error: "Error updating dct",
            });
          }

          const activity = await Activity.findOne({
            activityType: ACTIVITY_CREATE_DCT,
            dct: dctId,
          }).exec();
          if (activity) {
            if (
              !!dct.description.length &&
              !!dct.skills.length &&
              !!dct.projects.length &&
              !!dct.projectsDetail.length &&
              !!dct.formations.length &&
              !!dct.tecnicalSkills.length &&
              !!dct.linguistics.length
            )
              activity.remove();
          }

          return res.status(200).json({
            dct,
            message: `Your DCT are been updated successfully on our database.`,
          });
        });
      });
    }
  } catch (error) {
    res.status(400).json({
      message: "Something wrong bad. Try again !!!",
    });
  }
};

export const dctUpdateMatricule = async (req, res) => {
  try {
    const { matricule } = req.body;
    const dctId = req.params._id;
    let dctByMatricule = await Dct.findOne({ matricule });
    if (dctByMatricule) {
      return res.status(400).json({
        message: `Matricule ${matricule} already associated with another DCT candidate. Try another one`,
      });
    } else {
      let dct = await Dct.findOne({ _id: dctId })
        .populate("sector")
        .populate("expertise")
        .populate("user");

      if (dct) {
        let updatedField = {
          matricule: matricule.toUpperCase(),
        };
        dct = _.extend(dct, updatedField);

        dct.save(async (err, result) => {
          console.log(err);
          if (err) {
            return res.status(400).json({
              error: "Error updating dct",
            });
          }

          // All is completed for DCT, I can delete the activity if existed
          const activity = await Activity.findOne({
            activityType: ACTIVITY_CREATE_DCT,
            dct: dctId,
          }).exec();
          if (activity) {
            if (
              !!dct.description.length &&
              !!dct.skills.length &&
              !!dct.projects.length &&
              !!dct.projectsDetail.length &&
              !!dct.formations.length &&
              !!dct.tecnicalSkills.length &&
              !!dct.linguistics.length
            )
              activity.remove();
          }

          return res.status(200).json({
            dct,
            message: `Your DCT are been updated successfully on our database.`,
          });
        });
      } else {
        res.status(404).send({ message: `Dct to update not found` });
      }
    }
  } catch (error) {
    res.status(400).json({
      message: "Something wrong bad. Try again !!!",
    });
  }
};

export const dctDownload = async (req, res) => {
  try {
    const dctId = req.params._id;
    let dct = await Dct.findOne({ _id: dctId }).populate("expertise user");
console.log(dct);
    if (dct) {
      let projectsDetailFormat = dct.projectsDetail.map((project) => ({
        ...project,
        startDate: project.startDate,
        endDate: project.endDate,
        showTechnicalEnvironment: !!project.technicalEnvironment.length
          ? true
          : false,
        showProjectTitle: !!project.projectTitle.length ? true : false,
      }));
      let salaryFormat = dct.salaryType === MONTH
      ? `Entre ${dct.salaryRange[0]}00€ - ${dct.salaryRange[1]}00€ net par mois`
      : `Entre ${dct.salaryRange[0]}K€ - ${dct.salaryRange[1]}K€ brut par an`;
      const data = {
        lastName: dct.user.lastName,
        firstName: dct.user.firstName,
        profession: dct.expertise.name.toUpperCase(),
        matricule: dct.matricule,
        expNumber: dct.expNumber,
        salary: salaryFormat,
        description: dct.description,
        skills: dct.skills,
        projects: dct.projects,
        projectsDetail: projectsDetailFormat,
        formations: dct.formations,
        tecnicalSkills: dct.tecnicalSkills,
        linguistics: dct.linguistics,
      };
      const handler = new TemplateHandler();
      const doc = await handler.process(templateFile, data);

      console.log(data);
      return res
        .status(200)
        .json({ doc, dct, message: "DCT downloaded successfully." });
    } else {
      res.status(404).send({ message: `Dct not found` });
    }
  } catch (error) {
    res.status(400).json({
      message: "Something wrong bad. Try again !!!",
    });
  }
};

export const dctDelete = async (req, res) => {
  const dctId = req.params._id;
  try {
    const dct = await Dct.findOne({ _id: dctId }).exec();
    if (dct) {
      const activity = await Activity.findOne({ dct: dctId }).exec();
      if (activity) {
        await activity.remove();
      }
      await dct.remove();
      res.status(200).json({ message: "Dct deleted successfully." });
    } else {
      res.status(404).json({ message: "Dct not found." });
    }
  } catch (error) {
    res.status(400).json({
      message: "Something wrong bad. Try again !!!",
    });
  }
};
