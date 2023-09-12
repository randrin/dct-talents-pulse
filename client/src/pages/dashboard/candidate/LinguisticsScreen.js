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
import TalentsPulseStepSevenDetail from "../../../composants/details/TalentsPulseStepSevenDetail";
import TalentsPulseEmptyDataStep from "../../../composants/inc/TalentsPulseEmptyDataStep";
import {
  ArrowLeftOutlined,
  CheckOutlined,
  EditOutlined,
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { dctUpdate, getDctByUser } from "../../../services/dctService";
import { talentsPulseGetToken } from "../../../utils";
import { ACTION_EDIT, DCT_ACTION_LINGUISTICS } from "../../../utils/constants";

const LinguisticsScreen = () => {
  // States
  const [api, contextHolder] = notification.useNotification();
  const [dct, setDct] = useState({});
  const [loading, setLoading] = useState(false);
  const [actionEdit, setActionEdit] = useState(false);
  const [isEmptyData, setIsEmptyData] = useState(false);
  const [linguistic, setLinguistic] = useState({
    language: "",
    level: "",
  });
  const [detailIndex, setDetailIndex] = useState(0);
  const [detailMode, setDetailMode] = useState("");
  const [showBoxLinguistic, setShowBoxLinguistic] = useState(false);
  const [showAddBtn, setShowAddBtn] = useState(false);

  // Destructing
  const { Title } = Typography;
  const { Option } = Select;
  const { language, level } = linguistic;
  const { linguistics } = dct;

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
        console.log("LinguisticsScreen -> findDct Error: ", error.response);
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

  const handleOnAddLinguistic = () => {
    setShowBoxLinguistic(true);
    setShowAddBtn(false);
  };

  const handleOnSaveLinguistic = () => {
    if (detailMode === ACTION_EDIT) {
      linguistics.map((d, index) => {
        if (index === detailIndex) {
          linguistics[index] = linguistic;
        }
      });
    } else {
      handleOnChangeDct(linguistic);
    }
    handleOnSaveDct();
    handleOnCancelLinguistic();
    setActionEdit(true);
  };

  const handleOnChangeDct = (e) => {
    linguistics?.push(e);
    setDct({
      ...dct,
      linguistics,
    });
  };

  const handleOnCancelLinguistic = () => {
    setShowBoxLinguistic(false);
    setShowAddBtn(true);
    setDetailMode("");
    setLinguistic({});
    setActionEdit(true);
  };

  const handleOnValidateLinguistic = () => {
    return !!language?.length && !!level?.length ? false : true;
  };

  const handleOnEditStepSeven = (index) => {
    setLinguistic(linguistics.find((skill, e) => e === index));
    setDetailIndex(index);
    setDetailMode(ACTION_EDIT);
    setShowAddBtn(false);
    setShowBoxLinguistic(true);
  };

  const handleOnDeleteStepSeven = (index) => {
    linguistics.map((project, e) => {
      if (index === e) {
        linguistics.splice(index, 1);
      }
    });
    handleOnSaveDct();
    setDct({ ...dct, linguistics });
    setIsEmptyData(!!linguistics?.length ? false : true);
    setActionEdit(true);
  };

  const handleOnUpdateDct = () => {
    setActionEdit(!actionEdit);
    setShowAddBtn(!showAddBtn);
  };

  const handleOnBack = () => {
    setActionEdit(!actionEdit);
    setShowAddBtn(false);
    setShowBoxLinguistic(false);
    setLinguistic({});
    findDct();
  };

  const handleOnSaveDct = async () => {
    setLoading(true);
    await dctUpdate(dct, DCT_ACTION_LINGUISTICS, talentsPulseGetToken())
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
        setShowBoxLinguistic(false);
        setLinguistic({});
      })
      .catch((error) => {
        console.log(
          "LinguisticsScreen -> handleOnSaveDct Error: ",
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
      <DashboardLayout defaultKey={"6"} className="dct-dashboard-wrapper">
        {contextHolder}
        <div className="container-fluid">
          <Title level={2} className="text-left dct-talents-pulse-secondary">
            Acquis Linguistiques
          </Title>
          <Divider className="dct-talents-pulse-background-sliver dct-talents-pulse-without-margin" />
          {!showBoxLinguistic && (
            <div className="row mt-5 talents-pulse-step-linguistics-container">
              {!!linguistics?.length ? (
                <TalentsPulseStepSevenDetail
                  linguistics={linguistics}
                  handleOnEditStepSeven={handleOnEditStepSeven}
                  handleOnDeleteStepSeven={handleOnDeleteStepSeven}
                  showActions={actionEdit}
                />
              ) : (
                <TalentsPulseEmptyDataStep
                  title={"Vous n'avez aucune maitrise de langage"}
                  description={
                    "Précisez vos diffèrents langages de communication maitrisés"
                  }
                  btnTitle={"Insérez un langage"}
                  handleOnBtnAction={handleOnAddLinguistic}
                  showContent={!showBoxLinguistic}
                />
              )}
            </div>
          )}
          {showBoxLinguistic && (
            <div className="row mb-5 dct-talents-pulse-steps-form mt-5">
              <div className="col-md-4">
                <label htmlFor="language">
                  Langage
                  <span className="dct-talents-pulse-field-required">*</span>
                </label>
                <Input
                  name="language"
                  value={language}
                  size="large"
                  onChange={(e) =>
                    setLinguistic({ ...linguistic, language: e.target.value })
                  }
                  placeholder="Français, Anglais, Italien, ..."
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="degree">
                  Niveau
                  <span className="dct-talents-pulse-field-required">*</span>
                </label>
                <Select
                  style={{ width: "100%" }}
                  value={level}
                  placeholder="Choissisez un élement"
                  size="large"
                  onChange={(e) => setLinguistic({ ...linguistic, level: e })}
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
                    onClick={handleOnCancelLinguistic}
                  />
                </Tooltip>
                <Tooltip title="Save">
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<CheckOutlined />}
                    disabled={handleOnValidateLinguistic()}
                    onClick={handleOnSaveLinguistic}
                  />
                </Tooltip>
              </div>
            </div>
          )}
          {showAddBtn && (!!linguistics?.length || isEmptyData) && (
            <Button
              type="dashed"
              size="large"
              onClick={handleOnAddLinguistic}
              className="mb-4 mt-4 talents-pulse-standard-title talents-pulse-btn-add"
            >
              <PlusOutlined /> Ajouter un langage
            </Button>
          )}
          {(!!linguistics?.length || isEmptyData) && (
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

export default LinguisticsScreen;
