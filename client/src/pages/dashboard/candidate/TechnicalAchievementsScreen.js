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
import React, { useEffect, useState } from "react";
import DashboardLayout from "../DashboardLayout";
import TalentsPulseEmptyDataStep from "../../../composants/inc/TalentsPulseEmptyDataStep";
import TalentsPulseStepSixDetail from "../../../composants/details/TalentsPulseStepSixDetail";
import {
  ArrowLeftOutlined,
  CheckOutlined,
  EditOutlined,
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { dctUpdate, getDctByUser } from "../../../services/dctService";
import { talentsPulseGetToken } from "../../../utils";
import {
  ACTION_EDIT,
  DCT_ACTION_TECNICAL_SKILLS,
} from "../../../utils/constants";

const TechnicalAchievementsScreen = () => {
  // States
  const [api, contextHolder] = notification.useNotification();
  const [skill, setSkill] = useState({
    software: "",
    level: "",
  });
  const [dct, setDct] = useState({});
  const [loading, setLoading] = useState(false);
  const [actionEdit, setActionEdit] = useState(false);
  const [detailIndex, setDetailIndex] = useState(0);
  const [detailMode, setDetailMode] = useState("");
  const [showBoxSkill, setShowBoxSkill] = useState(false);
  const [showAddBtn, setShowAddBtn] = useState(false);
  const [isEmptyData, setIsEmptyData] = useState(false);

  // Destructing
  const { Title } = Typography;
  const { Option } = Select;
  const { software, level } = skill;
  const { tecnicalSkills } = dct;

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
        console.log(
          "TechnicalAchievementsScreen -> findDct Error: ",
          error.response
        );
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
      handleOnChangeDct(skill);
    }
    handleOnSaveDct();
    handleOnCancelSkill();
  };

  const handleOnChangeDct = (e) => {
    tecnicalSkills?.push(e);
    setDct({
      ...dct,
      tecnicalSkills,
    });
  };

  const handleOnCancelSkill = () => {
    setShowBoxSkill(false);
    setShowAddBtn(true);
    setActionEdit(true);
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
    handleOnSaveDct();
    setDct({ ...dct, tecnicalSkills });
    setIsEmptyData(!!tecnicalSkills?.length ? false : true);
    setActionEdit(true);
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
    await dctUpdate(dct, DCT_ACTION_TECNICAL_SKILLS, talentsPulseGetToken())
      .then((res) => {
        console.log(res);
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
        console.log(
          "TechnicalAchievementsScreen -> handleOnSaveDct Error: ",
          error.response
        );
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
      <DashboardLayout defaultKey={"7"} className="dct-dashboard-wrapper">
        {contextHolder}
        <div className="container-fluid">
          <Title level={2} className="text-left dct-talents-pulse-secondary">
            Acquis Techniques
          </Title>
          <Divider className="dct-talents-pulse-background-sliver" />
          {!showBoxSkill && (
            <div className="row mt-5 talents-pulse-step-skills-container">
              {!!tecnicalSkills?.length ? (
                <TalentsPulseStepSixDetail
                  tecnicalSkills={tecnicalSkills}
                  handleOnEditStepSix={handleOnEditStepSix}
                  handleOnDeleteStepSix={handleOnDeleteStepSix}
                  showActions={actionEdit}
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
          {showAddBtn && (!!tecnicalSkills?.length || isEmptyData) && (
            <Button
              type="dashed"
              size="large"
              onClick={handleOnAddSkill}
              className="mb-4 mt-4 talents-pulse-standard-title talents-pulse-btn-add"
            >
              <PlusOutlined /> Ajouter un logiciel
            </Button>
          )}
          {(!!tecnicalSkills?.length || isEmptyData) && (
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
        </div>
      </DashboardLayout>
    </Spin>
  );
};

export default TechnicalAchievementsScreen;
