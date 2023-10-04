import React, { useState } from "react";
import {
  QuestionCircleOutlined,
  PlusOutlined,
  MinusOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import {
  Button,
  Divider,
  Drawer,
  Input,
  Select,
  Spin,
  Tooltip,
  Typography,
  notification,
} from "antd";
import TalentsPulseNextPreviousStep from "./TalentsPulseNextPreviousStep";
import TalentsPulseStepTwoDetail from "../details/TalentsPulseStepTwoDetail";
import TalentsPulseEmptyDataStep from "./TalentsPulseEmptyDataStep";
import { ACTION_EDIT, DCT_ACTION_SKILLS } from "../../utils/constants";
import { talentsPulseGetToken } from "../../utils";
import { dctUpdate } from "../../services/dctService";

const TalentsPulseStepTwo = ({
  steps,
  current,
  handleOnPrevious,
  handleOnNext,
  dct,
  setDct,
  handleOnChangeStepTwo,
  title,
}) => {
  // States
  const [skill, setSkill] = useState({
    content: "",
    level: "",
  });
  const [detailIndex, setDetailIndex] = useState(0);
  const [detailMode, setDetailMode] = useState("");
  const [open, setOpen] = useState(false);
  const [showBoxSkill, setShowBoxSkill] = useState(false);
  const [showAddBtn, setShowAddBtn] = useState(true);
  const [loading, setLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  // Destructing
  const { Title } = Typography;
  const { Option } = Select;
  const { skills } = dct;

  // Functions
  const hanleOnOpenHelp = () => {
    setOpen(true);
  };

  const hanleOnCloseHelp = () => {
    setOpen(false);
  };

  const handleOnAddSkill = () => {
    setShowBoxSkill(true);
    setShowAddBtn(false);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleOnCancelSkill = () => {
    setShowAddBtn(true);
    setShowBoxSkill(false);
    setSkill({});
  };

  const handleOnSaveSkill = () => {
    if (detailMode === ACTION_EDIT) {
      skills?.map((d, index) => {
        if (index === detailIndex) {
          skills[index] = skill;
        }
      });
    } else {
      handleOnChangeStepTwo(skill);
    }
    handleOnSaveDct();
    setShowAddBtn(true);
    setShowBoxSkill(false);
    setDetailMode("");
    setSkill({});
  };

  const handleOnSaveDct = async () => {
    setLoading(true);
    let userDct = { ...dct, dctId: dct._id };
    await dctUpdate(userDct, DCT_ACTION_SKILLS, talentsPulseGetToken())
      .then((res) => {
        setDct(res.data.dct);
        api.success({
          message: "Succès",
          description: res.data.message,
          placement: "topRight",
        });
        setShowAddBtn(true);
        setShowBoxSkill(false);
        setSkill({});
      })
      .catch((error) => {
        console.log("TalentsPulseStepTwo -> handleOnSaveDct Error: ", error.response);
        api.error({
          message: "Erreur",
          description: error.response.data.message || error.response.data.error,
          placement: "topRight",
        });
      });
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleOnValidateSkill = () => {
    return skill?.content?.length >= 3 && !!skill?.level?.length ? false : true;
  };

  const handleOnValidate = () => {
    return !!skills?.length ? false : true;
  };

  const handleOnEditStepTwo = (index) => {
    setSkill(skills?.find((skill, e) => e === index));
    setDetailIndex(index);
    setDetailMode(ACTION_EDIT);
    setShowAddBtn(false);
    setShowBoxSkill(true);
  };

  const handleOnDeleteStepTwo = (index) => {
    skills?.map((skill, e) => {
      if (index === e) {
        skills?.splice(index, 1);
      }
    });
    setDct({ ...dct, skills });
    handleOnSaveDct();
  };

  // Render
  return (
    <Spin spinning={loading} size="large" tip="Loading">
      <div className="talents-pulse-step-skills-wrapper">
        {contextHolder}
        <Title
          level={1}
          className="dct-talents-pulse-secondary text-left talents-pulse-step-title"
        >
          {title}
          <Tooltip title="Besoin d'aide ?" color={"#00b5ec"} placement={"left"}>
            <QuestionCircleOutlined
              className="float-right mr-2"
              onClick={hanleOnOpenHelp}
            />
          </Tooltip>
        </Title>
        {!showBoxSkill && (
          <div className="row mt-5 talents-pulse-step-skills-container">
            {!!skills?.length ? (
              <TalentsPulseStepTwoDetail
                skills={skills}
                handleOnEditStepTwo={handleOnEditStepTwo}
                handleOnDeleteStepTwo={handleOnDeleteStepTwo}
                showActions={true}
              />
            ) : (
              <TalentsPulseEmptyDataStep
                title={"Vous n'avez aucune compétence métier"}
                description={
                  "Créez une compétence pour donner plus d'informations à votre candidature"
                }
                btnTitle={"Insérez une compétence"}
                handleOnBtnAction={handleOnAddSkill}
                showContent={!showBoxSkill}
              />
            )}
          </div>
        )}
        {showBoxSkill && (
          <div className="row mb-5 mt-5 dct-talents-pulse-steps-form ">
            <div className="col-md-8">
              <label htmlFor="skills">
                Compétence Technique
                <span className="dct-talents-pulse-field-required">*</span>
              </label>
              <Input
                name="skills"
                value={skill?.content}
                size="large"
                onChange={(e) =>
                  setSkill({ ...skill, content: e.target.value })
                }
                placeholder="Automatisation de processus métier et monitoring de workflow"
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="level">
                Niveau
                <span className="dct-talents-pulse-field-required">*</span>
              </label>
              <Select
                style={{ width: "100%" }}
                placeholder="Choissisez un élement"
                value={skill?.level}
                size="large"
                onChange={(e) => setSkill({ ...skill, level: e })}
              >
                <Option value="Débutant">Débutant</Option>
                <Option value="Intermédiaire">Intermédiaire</Option>
                <Option value="Confirmé">Confirmé</Option>
                <Option value="Expert">Expert</Option>
              </Select>
            </div>
            <div className="col-md-1 dct-talents-pulse-space-between">
              <Tooltip title="Cancel">
                <Button
                  type="primary"
                  className="dct-talents-pulse-btn-tomato mr-2"
                  danger
                  shape="circle"
                  icon={<MinusOutlined />}
                  onClick={handleOnCancelSkill}
                />
              </Tooltip>
              <Tooltip title="Save">
                <Button
                  type="primary"
                  shape="circle"
                  icon={<CheckOutlined />}
                  disabled={handleOnValidateSkill()}
                  onClick={handleOnSaveSkill}
                />
              </Tooltip>
            </div>
          </div>
        )}
        {showAddBtn && !!skills?.length && (
          <Button
            type="dashed"
            size="large"
            onClick={handleOnAddSkill}
            className="mb-4 mt-4 talents-pulse-standard-title talents-pulse-btn-add"
          >
            <PlusOutlined /> Ajouter une compétence
          </Button>
        )}
        <Drawer
          title="Comment remplir les compétences clés"
          placement="right"
          onClose={hanleOnCloseHelp}
          open={open}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Drawer>
        <Divider className="dct-talents-pulse-background-sliver" />
        <TalentsPulseNextPreviousStep
          dct={dct}
          steps={steps}
          current={current}
          handleOnPrevious={handleOnPrevious}
          handleOnNext={handleOnNext}
          handleOnValidate={handleOnValidate()}
        />
      </div>
    </Spin>
  );
};

export default TalentsPulseStepTwo;
