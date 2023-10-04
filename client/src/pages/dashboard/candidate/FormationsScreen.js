import React, { useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  Divider,
  Input,
  Spin,
  Tooltip,
  Typography,
  notification,
} from "antd";
import { dctUpdate, getDctByUser } from "../../../services/dctService";
import { talentsPulseGetToken } from "../../../utils";
import DashboardLayout from "../DashboardLayout";
import TalentsPulseStepFiveDetail from "../../../composants/details/TalentsPulseStepFiveDetail";
import TalentsPulseEmptyDataStep from "../../../composants/inc/TalentsPulseEmptyDataStep";
import {
  ArrowLeftOutlined,
  CheckOutlined,
  EditOutlined,
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  ACTION_EDIT,
  DCT_ACTION_FORMATIONS,
  FORMAT_MONTH_FORMAT,
} from "../../../utils/constants";
import moment from "moment";

const FormationsScreen = () => {
  // States
  const [api, contextHolder] = notification.useNotification();
  const [dct, setDct] = useState({});
  const [formation, setFormation] = useState({
    yearOfGraduation: new Date().getFullYear(),
    degree: "",
    establishment: "",
  });
  const [loading, setLoading] = useState(false);
  const [isEmptyData, setIsEmptyData] = useState(false);
  const [actionEdit, setActionEdit] = useState(false);
  const [detailIndex, setDetailIndex] = useState(0);
  const [detailMode, setDetailMode] = useState("");
  const [showBoxFormation, setShowBoxFormation] = useState(false);
  const [showAddBtn, setShowAddBtn] = useState(false);

  // Destructing
  const { Title } = Typography;
  const { yearOfGraduation, degree, establishment } = formation;
  const { formations } = dct;

  // Init
  const monthFormat = FORMAT_MONTH_FORMAT;
  useEffect(() => {
    findDct();
    handleOnGetYearOfGraduation();
  }, []);

  // Functions
  const findDct = async () => {
    setLoading(true);
    await getDctByUser(talentsPulseGetToken())
      .then((res) => {
        setDct(res.data.dct);
      })
      .catch((error) => {
        console.log("FormationsScreen -> findDct Error: ", error.response);
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

  const handleOnAddFormation = () => {
    setShowBoxFormation(true);
    setShowAddBtn(false);
    handleOnGetYearOfGraduation();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleOnSaveFormation = () => {
    if (detailMode === ACTION_EDIT) {
      formations.map((d, index) => {
        if (index === detailIndex) {
          formations[index] = formation;
        }
      });
    } else {
      handleOnChangeDct(formation);
    }
    handleOnSaveDct();
    handleOnCancelFormation();
    setActionEdit(true);
  };

  const handleOnChangeDct = (e) => {
    formations?.push(e);
    setDct({
      ...dct,
      formations,
    });
  };

  const handleOnCancelFormation = () => {
    setShowBoxFormation(false);
    setShowAddBtn(true);
    setDetailMode("");
    setFormation({});
    setActionEdit(true);
  };

  const handleOnValidateFormation = () => {
    return !!yearOfGraduation?.length &&
      degree?.length >= 3 &&
      establishment?.length >= 3
      ? false
      : true;
  };

  const handleOnEditStepFive = (index) => {
    setFormation(formations.find((formation, e) => e === index));
    setDetailIndex(index);
    setDetailMode(ACTION_EDIT);
    setShowAddBtn(false);
    setShowBoxFormation(true);
  };

  const handleOnGetYearOfGraduation = () => {
    // let currentMonth = new Date().getMonth() + 1;
    // let currentYear = new Date().getFullYear();
    // if (currentMonth.length < 2) currentMonth = "0" + currentMonth;
    const currentDate = moment(new Date()).format(monthFormat);
    // var todayDate = new Date().toLocaleDateString();
    // console.log(todayDate);
    setFormation({ ...formation, yearOfGraduation: currentDate });
    return moment(new Date()).format(monthFormat);
  };

  const handleOnDeleteStepFive = (index) => {
    formations.map((project, e) => {
      if (index === e) {
        formations.splice(index, 1);
      }
    });
    handleOnSaveDct();
    setDct({ ...dct, formations });
    setIsEmptyData(!!formations?.length ? false : true);
    setActionEdit(true);
  };

  const handleOnUpdateDct = () => {
    setActionEdit(!actionEdit);
    setShowAddBtn(!showAddBtn);
  };

  const handleOnBack = () => {
    setActionEdit(!actionEdit);
    setShowAddBtn(false);
    setShowBoxFormation(false);
    setFormation({});
    findDct();
  };

  const handleOnSaveDct = async () => {
    setLoading(true);
    await dctUpdate(dct, DCT_ACTION_FORMATIONS, talentsPulseGetToken())
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
        setShowBoxFormation(false);
        setFormation({});
      })
      .catch((error) => {
        console.log(
          "FormationsScreen -> handleOnSaveDct Error: ",
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
      <DashboardLayout defaultKey={"5"} className="dct-dashboard-wrapper">
        {contextHolder}
        <div className="container-fluid">
          <Title level={2} className="text-left dct-talents-pulse-secondary">
            Formations et Diplômes
          </Title>
          <Divider className="dct-talents-pulse-background-sliver dct-talents-pulse-without-margin" />
          {!showBoxFormation && (
            <div className="row mt-5 talents-pulse-step-formations-container">
              {!!formations?.length ? (
                <TalentsPulseStepFiveDetail
                  formations={formations}
                  handleOnEditStepFive={handleOnEditStepFive}
                  handleOnDeleteStepFive={handleOnDeleteStepFive}
                  showActions={actionEdit}
                />
              ) : (
                <TalentsPulseEmptyDataStep
                  title={"Vous n'avez aucune formation et/ou diplôme"}
                  description={
                    "Précisez vos diffèrentes formations académiques, diplômes ou certifications"
                  }
                  btnTitle={"Insérez une formation"}
                  handleOnBtnAction={handleOnAddFormation}
                  showContent={!showBoxFormation}
                />
              )}
            </div>
          )}
          {showBoxFormation && (
            <div className="row mb-5 mt-5 dct-talents-pulse-steps-form">
              <div className="col-md-2">
                <label htmlFor="yearOfGraduation">
                  Année d’obtention
                  <span className="dct-talents-pulse-field-required">*</span>
                </label>
                <br />
                <DatePicker
                  defaultValue={dayjs(yearOfGraduation, monthFormat)}
                  format={monthFormat}
                  picker="month"
                  size="large"
                  style={{ width: "100%" }}
                  onChange={(date, dateString) =>
                    setFormation({
                      ...formation,
                      yearOfGraduation: dateString,
                    })
                  }
                  placeholder="Selectionez une date"
                  name="yearOfGraduation"
                />
              </div>
              <div className="col-md-5">
                <label htmlFor="degree">
                  Diplôme
                  <span className="dct-talents-pulse-field-required">*</span>
                </label>
                <Input
                  name="degree"
                  value={degree}
                  size="large"
                  onChange={(e) =>
                    setFormation({ ...formation, degree: e.target.value })
                  }
                  placeholder="Ingénierie Génie Logiciel"
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="establishment">
                  Établissement / Lieu
                  <span className="dct-talents-pulse-field-required">*</span>
                </label>
                <Input
                  name="establishment"
                  value={establishment}
                  size="large"
                  onChange={(e) =>
                    setFormation({
                      ...formation,
                      establishment: e.target.value,
                    })
                  }
                  placeholder="École Polytechnique Paris"
                />
              </div>
              <div className="col-md-1 dct-talents-pulse-space-between">
                <Tooltip title="Cancel">
                  <Button
                    type="primary"
                    className="dct-talents-pulse-btn-tomato"
                    danger
                    shape="circle"
                    icon={<MinusOutlined />}
                    onClick={handleOnCancelFormation}
                  />
                </Tooltip>
                <Tooltip title="Save">
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<CheckOutlined />}
                    disabled={handleOnValidateFormation()}
                    onClick={handleOnSaveFormation}
                  />
                </Tooltip>
              </div>
            </div>
          )}
          {showAddBtn && (!!formations?.length || isEmptyData) && (
            <Button
              type="dashed"
              size="large"
              onClick={handleOnAddFormation}
              className="mb-4 mt-4 talents-pulse-standard-title talents-pulse-btn-add"
            >
              <PlusOutlined /> Ajouter une formation
            </Button>
          )}
          {(!!formations?.length || isEmptyData) && (
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

export default FormationsScreen;
