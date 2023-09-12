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
import TalentsPulseStepSixDetail from "../details/TalentsPulseStepSixDetail";
import TalentsPulseEmptyDataStep from "./TalentsPulseEmptyDataStep";
import { ACTION_EDIT, DCT_ACTION_TECNICAL_SKILLS } from "../../utils/constants";
import { talentsPulseGetToken } from "../../utils";
import { dctUpdate } from "../../services/dctService";

const TalentsPulseStepSix = ({
  steps,
  current,
  handleOnPrevious,
  handleOnNext,
  dct,
  setDct,
  handleOnChangeStepSix,
  title,
}) => {
  // States
  const [skill, setSkill] = useState({
    software: "",
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
  const { software, level } = skill;
  const { tecnicalSkills } = dct;

  // Functions
  const hanleOnOpenHelp = () => {
    setOpen(true);
  };

  const hanleOnCloseHelp = () => {
    setOpen(false);
  };

  const handleOnValidate = () => {
    return !!tecnicalSkills?.length ? false : true;
  };

  const handleOnAddSkill = () => {
    setShowBoxSkill(true);
    setShowAddBtn(false);
  };

  const handleOnSaveSkill = () => {
    if (detailMode === ACTION_EDIT) {
      tecnicalSkills.map((d, index) => {
        if (index === detailIndex) {
          tecnicalSkills[index] = skill;
        }
      });
    } else {
      handleOnChangeStepSix(skill);
    }
    handleOnSaveDct();
    handleOnCancelSkill();
  };

  const handleOnCancelSkill = () => {
    setShowBoxSkill(false);
    setShowAddBtn(true);
    setDetailMode("");
    setSkill({});
  };

  const handleOnValidateSkill = () => {
    return !!software?.length && !!level?.length ? false : true;
  };

  const handleOnEditStepSix = (index) => {
    setSkill(tecnicalSkills.find((skill, e) => e === index));
    setDetailIndex(index);
    setDetailMode(ACTION_EDIT);
    setShowAddBtn(false);
    setShowBoxSkill(true);
  };

  const handleOnDeleteStepSix = (index) => {
    tecnicalSkills.map((project, e) => {
      if (index === e) {
        tecnicalSkills.splice(index, 1);
      }
    });
    setDct({ ...dct, tecnicalSkills });
    handleOnSaveDct();
  };

  const handleOnSaveDct = async () => {
    setLoading(true);
    let userDct = { ...dct, dctId: dct._id };
    await dctUpdate(userDct, DCT_ACTION_TECNICAL_SKILLS, talentsPulseGetToken())
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
        console.log("TalentsPulseStepSix -> handleOnSaveDct Error: ", error.response);
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
            {!!tecnicalSkills.length ? (
              <TalentsPulseStepSixDetail
                tecnicalSkills={tecnicalSkills}
                handleOnEditStepSix={handleOnEditStepSix}
                handleOnDeleteStepSix={handleOnDeleteStepSix}
                showActions={true}
              />
            ) : (
              <TalentsPulseEmptyDataStep
                title={"Vous n'avez aucune maitrise technique"}
                description={
                  "Précisez vos diffèrents logiciels et/ou outils techniques maitrisés"
                }
                btnTitle={"Insérez un logiciel"}
                handleOnBtnAction={handleOnAddSkill}
                showContent={!showBoxSkill}
              />
            )}
          </div>
        )}
        {showBoxSkill && (
          <div className="row mb-5 dct-talents-pulse-steps-form mt-5">
            <div className="col-md-8">
              <label htmlFor="software">
                Logiciel
                <span className="dct-talents-pulse-field-required">*</span>
              </label>
              <Input
                name="software"
                value={software}
                size="large"
                onChange={(e) =>
                  setSkill({ ...skill, software: e.target.value })
                }
                placeholder="Cata V5, Angular, Java/J2ee, ..."
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="degree">
                Niveau
                <span className="dct-talents-pulse-field-required">*</span>
              </label>
              <Select
                style={{ width: "100%" }}
                value={level}
                placeholder="Choissisez un élement"
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
        {showAddBtn && !!tecnicalSkills.length && (
          <Button
            type="dashed"
            size="large"
            onClick={handleOnAddSkill}
            className="mb-4 mt-4 talents-pulse-standard-title talents-pulse-btn-add"
          >
            <PlusOutlined /> Ajouter un logiciel
          </Button>
        )}
        <Drawer
          title="Comment remplir les acquis techniques"
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

export default TalentsPulseStepSix;
