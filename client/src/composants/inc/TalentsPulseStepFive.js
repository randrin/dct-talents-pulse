import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  QuestionCircleOutlined,
  PlusOutlined,
  MinusOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Divider,
  Drawer,
  Input,
  Spin,
  Tooltip,
  Typography,
  notification,
} from "antd";
import TalentsPulseNextPreviousStep from "./TalentsPulseNextPreviousStep";
import TalentsPulseStepFiveDetail from "../details/TalentsPulseStepFiveDetail";
import TalentsPulseEmptyDataStep from "./TalentsPulseEmptyDataStep";
import moment from "moment";
import {
  ACTION_EDIT,
  DCT_ACTION_FORMATIONS,
  FORMAT_MONTH_FORMAT,
} from "../../utils/constants";
import { talentsPulseGetToken } from "../../utils";
import { dctUpdate } from "../../services/dctService";

const TalentsPulseStepFive = ({
  steps,
  current,
  handleOnPrevious,
  handleOnNext,
  dct,
  setDct,
  handleOnChangeStepFive,
  title,
}) => {
  // States
  const [formation, setFormation] = useState({
    yearOfGraduation: "",
    degree: "",
    establishment: "",
  });
  const [detailIndex, setDetailIndex] = useState(0);
  const [detailMode, setDetailMode] = useState("");
  const [open, setOpen] = useState(false);
  const [showBoxFormation, setShowBoxFormation] = useState(false);
  const [showAddBtn, setShowAddBtn] = useState(true);
  const [loading, setLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  // Destructing
  const { Title } = Typography;
  const { yearOfGraduation, degree, establishment } = formation;
  const { formations } = dct;

  // Init
  const monthFormat = FORMAT_MONTH_FORMAT;
  useEffect(() => {
    handleOnGetYearOfGraduation();
  }, []);

  // Functions
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

  const hanleOnOpenHelp = () => {
    setOpen(true);
  };

  const hanleOnCloseHelp = () => {
    setOpen(false);
  };

  const handleOnValidate = () => {
    return !!formations?.length ? false : true;
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
      handleOnChangeStepFive(formation);
    }
    handleOnSaveDct();
    handleOnCancelFormation();
  };

  const handleOnSaveDct = async () => {
    setLoading(true);
    let userDct = { ...dct, dctId: dct._id };
    await dctUpdate(userDct, DCT_ACTION_FORMATIONS, talentsPulseGetToken())
      .then((res) => {
        setDct(res.data.dct);
        api.success({
          message: "Succès",
          description: res.data.message,
          placement: "topRight",
        });
        setShowAddBtn(true);
        setShowBoxFormation(false);
        setFormation({});
      })
      .catch((error) => {
        console.log(
          "TalentsPulseStepFive -> handleOnSaveDct Error: ",
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

  const handleOnCancelFormation = () => {
    setShowBoxFormation(false);
    setShowAddBtn(true);
    setDetailMode("");
    setFormation({});
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

  const handleOnDeleteStepFive = (index) => {
    formations.map((project, e) => {
      if (index === e) {
        formations.splice(index, 1);
      }
    });
    setDct({ ...dct, formations });
    handleOnSaveDct();
  };

  // Render
  return (
    <Spin spinning={loading} size="large" tip="Loading">
      <div className="talents-pulse-step-formations-wrapper">
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
        {!showBoxFormation && (
          <div className="row mt-5 talents-pulse-step-formations-container">
            {!!formations.length ? (
              <TalentsPulseStepFiveDetail
                formations={formations}
                handleOnEditStepFive={handleOnEditStepFive}
                handleOnDeleteStepFive={handleOnDeleteStepFive}
                showActions={true}
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
                  setFormation({ ...formation, establishment: e.target.value })
                }
                placeholder="École Polytechnique Paris"
              />
            </div>
            <div className="col-md-1 dct-talents-pulse-space-between">
              <Tooltip title="Cancel">
                <Button
                  type="primary"
                  className="dct-talents-pulse-btn-tomato mr-2"
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
        {showAddBtn && !!formations.length && (
          <Button
            type="dashed"
            size="large"
            onClick={handleOnAddFormation}
            className="mb-4 mt-4 talents-pulse-standard-title talents-pulse-btn-add"
          >
            <PlusOutlined /> Ajouter une formation
          </Button>
        )}
        <Drawer
          title="Comment remplir les formations"
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

export default TalentsPulseStepFive;
