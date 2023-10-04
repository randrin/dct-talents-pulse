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
import TalentsPulseStepSevenDetail from "../details/TalentsPulseStepSevenDetail";
import TalentsPulseEmptyDataStep from "./TalentsPulseEmptyDataStep";
import { ACTION_EDIT, DCT_ACTION_LINGUISTICS } from "../../utils/constants";
import { talentsPulseGetToken } from "../../utils";
import { dctUpdate } from "../../services/dctService";

const TalentsPulseStepSeven = ({
  steps,
  current,
  handleOnPrevious,
  handleOnNext,
  dct,
  setDct,
  handleOnChangeStepSeven,
  title,
}) => {
  // States
  const [linguistic, setLinguistic] = useState({
    language: "",
    level: "",
  });
  const [detailIndex, setDetailIndex] = useState(0);
  const [detailMode, setDetailMode] = useState("");
  const [open, setOpen] = useState(false);
  const [showBoxLinguistic, setShowBoxLinguistic] = useState(false);
  const [showAddBtn, setShowAddBtn] = useState(true);
  const [loading, setLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  // Destructing
  const { Title } = Typography;
  const { Option } = Select;
  const { language, level } = linguistic;
  const { linguistics } = dct;

  // Functions
  const hanleOnOpenHelp = () => {
    setOpen(true);
  };

  const hanleOnCloseHelp = () => {
    setOpen(false);
  };

  const handleOnValidate = () => {
    return !!linguistics?.length ? false : true;
  };

  const handleOnAddLinguistic = () => {
    setShowBoxLinguistic(true);
    setShowAddBtn(false);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleOnSaveLinguistic = () => {
    if (detailMode === ACTION_EDIT) {
      linguistics.map((d, index) => {
        if (index === detailIndex) {
          linguistics[index] = linguistic;
        }
      });
    } else {
      handleOnChangeStepSeven(linguistic);
    }
    handleOnSaveDct();
    handleOnCancelLinguistic();
  };

  const handleOnCancelLinguistic = () => {
    setShowBoxLinguistic(false);
    setShowAddBtn(true);
    setDetailMode("");
    setLinguistic({});
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
    setDct({ ...dct, linguistics });
    handleOnSaveDct();
  };

  const handleOnSaveDct = async () => {
    setLoading(true);
    let userDct = { ...dct, dctId: dct._id };
    await dctUpdate(userDct, DCT_ACTION_LINGUISTICS, talentsPulseGetToken())
      .then((res) => {
        setDct(res.data.dct);
        api.success({
          message: "Succès",
          description: res.data.message,
          placement: "topRight",
        });
        setShowAddBtn(true);
        setShowBoxLinguistic(false);
        setLinguistic({});
      })
      .catch((error) => {
        console.log(
          "TalentsPulseStepSeven -> handleOnSaveDct Error: ",
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
      <div className="talents-pulse-step-linguistics-wrapper">
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
        {!showBoxLinguistic && (
          <div className="row mt-5 talents-pulse-step-linguistics-container">
            {!!linguistics?.length ? (
              <TalentsPulseStepSevenDetail
                linguistics={linguistics}
                handleOnEditStepSeven={handleOnEditStepSeven}
                handleOnDeleteStepSeven={handleOnDeleteStepSeven}
                showActions={true}
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
                  className="dct-talents-pulse-btn-tomato mr-2"
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
        {showAddBtn && !!linguistics.length && (
          <Button
            type="dashed"
            size="large"
            onClick={handleOnAddLinguistic}
            className="mb-4 mt-4 talents-pulse-standard-title talents-pulse-btn-add"
          >
            <PlusOutlined /> Ajouter un langage
          </Button>
        )}
        <Drawer
          title="Comment remplir les acquis linguistiques"
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

export default TalentsPulseStepSeven;
