import React, { useEffect, useState } from "react";
import {
  Button,
  Divider,
  Input,
  Select,
  Spin,
  Tooltip,
  Typography,
  notification,
} from "antd";
import DashboardLayout from "../DashboardLayout";
import { talentsPulseGetToken } from "../../../utils";
import { dctUpdate, getDctByUser } from "../../../services/dctService";
import TalentsPulseStepTwoDetail from "../../../composants/details/TalentsPulseStepTwoDetail";
import TalentsPulseEmptyDataStep from "../../../composants/inc/TalentsPulseEmptyDataStep";
import {
  ArrowLeftOutlined,
  CheckOutlined,
  EditOutlined,
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { ACTION_EDIT, DCT_ACTION_SKILLS } from "../../../utils/constants";

const SkillsScreen = () => {
  // States
  const [api, contextHolder] = notification.useNotification();
  const [dct, setDct] = useState({});
  const [loading, setLoading] = useState(false);
  const [actionEdit, setActionEdit] = useState(false);
  const [isEmptyData, setIsEmptyData] = useState(false);
  const [showBoxSkill, setShowBoxSkill] = useState(false);
  const [showAddBtn, setShowAddBtn] = useState(false);
  const [skill, setSkill] = useState({
    content: "",
    level: "",
  });
  const [detailMode, setDetailMode] = useState("");
  const [detailIndex, setDetailIndex] = useState(0);

  // Destructing
  const { Title } = Typography;
  const { Option } = Select;
  const { skills } = dct;

  // Init
  useEffect(() => {
    findDct();
  }, []);

  // Functions
  const findDct = async () => {
    setLoading(true);
    await getDctByUser(talentsPulseGetToken())
      .then((res) => {
        setDct(res.data.dct);
      })
      .catch((error) => {
        console.log("SkillsScreen -> findDct Error: ", error.response);
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
    handleOnSaveDct();
    setDct({ ...dct, skills });
    setIsEmptyData(!!skills?.length ? false : true);
    setActionEdit(true);
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
      handleOnChangeDct(skill);
    }
    handleOnSaveDct();
    setShowAddBtn(true);
    setShowBoxSkill(false);
    setActionEdit(true);
    setDetailMode("");
    setSkill({});
  };

  const handleOnChangeDct = (e) => {
    skills?.push(e);
    setDct({
      ...dct,
      skills,
    });
  };

  const handleOnValidateSkill = () => {
    return skill?.content?.length >= 3 && !!skill?.level?.length ? false : true;
  };

  const handleOnUpdateDct = () => {
    setActionEdit(!actionEdit);
    setShowAddBtn(!showAddBtn);
  };

  const handleOnBack = () => {
    setActionEdit(!actionEdit);
    setShowAddBtn(false);
    setShowBoxSkill(false);
    setSkill({});
    findDct();
  };

  const handleOnSaveDct = async () => {
    setLoading(true);
    await dctUpdate(dct, DCT_ACTION_SKILLS, talentsPulseGetToken())
      .then((res) => {
        setDct(res.data.dct);
        api.success({
          message: "Succès",
          description: res.data.message,
          placement: "topRight",
        });
        setActionEdit(false);
        setShowAddBtn(false);
        setShowBoxSkill(false);
        setSkill({});
      })
      .catch((error) => {
        console.log("SkillsScreen -> handleOnSaveDct Error: ", error.response);
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
      <DashboardLayout defaultKey={"3"} className="dct-dashboard-wrapper">
        {contextHolder}
        <div className="container-fluid">
          <Title level={2} className="text-left dct-talents-pulse-secondary">
            Compétences Techniques
          </Title>
          <Divider className="dct-talents-pulse-background-sliver dct-talents-pulse-without-margin" />
          {!showBoxSkill && (
            <div className="row mt-5 talents-pulse-step-skills-container">
              {!!skills?.length ? (
                <TalentsPulseStepTwoDetail
                  skills={skills}
                  handleOnEditStepTwo={handleOnEditStepTwo}
                  handleOnDeleteStepTwo={handleOnDeleteStepTwo}
                  showActions={actionEdit}
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
                    className="dct-talents-pulse-btn-tomato"
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
          {showAddBtn && (!!skills?.length || isEmptyData) && (
            <Button
              type="dashed"
              size="large"
              onClick={handleOnAddSkill}
              className="mb-4 mt-4 talents-pulse-standard-title talents-pulse-btn-add"
            >
              <PlusOutlined /> Ajouter une compétence
            </Button>
          )}
        </div>
        {(!!skills?.length || isEmptyData) && (
          <div className="row mt-5 dct-talents-pulse-space-end">
            {actionEdit ? (
              <>
                <div className="col-md-2">
                  <Button
                    type="primary"
                    className="mb-3 dct-talents-pulse-btn-outline-tomato"
                    block
                    onClick={handleOnBack}
                    shape="round"
                    size="large"
                  >
                    <ArrowLeftOutlined /> Abandonnez
                  </Button>
                </div>
                {/* <div className="col-md-2">
                  <Button
                    type="primary"
                    className="mb-3 dct-talents-pulse-btn-secondary"
                    block
                    onClick={handleOnSaveDct}
                    shape="round"
                    size="large"
                    disabled={false}
                  >
                    <CheckCircleOutlined /> Enregitrez
                  </Button>
                </div> */}
              </>
            ) : (
              <div className="col-md-2">
                <Button
                  type="primary"
                  className="mb-3 dct-talents-pulse-btn-secondary"
                  block
                  onClick={handleOnUpdateDct}
                  shape="round"
                  size="large"
                  disabled={false}
                >
                  <EditOutlined /> Mettre à jour
                </Button>
              </div>
            )}
          </div>
        )}
      </DashboardLayout>
    </Spin>
  );
};

export default SkillsScreen;
