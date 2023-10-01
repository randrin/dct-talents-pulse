import React, { useState } from "react";
import {
  Button,
  Divider,
  Input,
  InputNumber,
  Select,
  Slider,
  Spin,
  Tooltip,
  Typography,
  notification,
} from "antd";
import TalentsPulseNextPreviousStep from "./TalentsPulseNextPreviousStep";
import { CheckOutlined } from "@ant-design/icons";
import { talentsPulseGetToken } from "../../utils";
import {
  DCT_ACTION_DESCRIPTION,
  DCT_ACTION_SALARY,
  HOUR,
  MONTH,
  YEAR,
} from "../../utils/constants";
import { dctUpdate } from "../../services/dctService";

const TalentsPulseStepOne = ({
  steps,
  current,
  handleOnPrevious,
  handleOnNext,
  dct,
  setDct,
  handleOnChangeStepOne,
  handleOnChangeStepOneSalary,
  title,
}) => {
  // States
  const [loading, setLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const monthMarks = {
    0: "0",
    100: {
      style: {
        color: "#e60000",
      },
      label: "<10000€",
    },
  };
  const yearMarks = {
    0: "0",
    100: {
      style: {
        color: "#e60000",
      },
      label: "<100K€",
    },
  };

  // Destructing
  const { Title } = Typography;
  const { TextArea } = Input;
  const { Option } = Select;

  // Functions
  const handleOnValidate = () => {
    return dct?.description?.length >= 50 ? false : true;
  };

  const handleOnValidateSalary = () => {
    return !!dct?.salaryType?.length &&
      (!!dct?.salaryRange?.length || !!dct?.salaryHour?.length)
      ? false
      : true;
  };

  const handleOnSaveDescription = async (type) => {
    setLoading(true);
    let userDct = { ...dct, dctId: dct._id };
    if (type === DCT_ACTION_DESCRIPTION) {
      await dctUpdate(userDct, type, talentsPulseGetToken())
        .then((res) => {
          setDct(res.data.dct);
          api.success({
            message: "Succès",
            description: res.data.message,
            placement: "topRight",
          });
          handleOnNext();
        })
        .catch((error) => {
          console.log(
            "TalentsPulseStepOne -> handleOnSaveDct Error: ",
            error.response
          );
          api.error({
            message: "Erreur",
            description:
              error.response.data.message || error.response.data.error,
            placement: "topRight",
          });
        });
    }
    if (type === DCT_ACTION_SALARY) {
      await dctUpdate(userDct, type, talentsPulseGetToken())
        .then((res) => {
          setDct(res.data.dct);
          api.success({
            message: "Succès",
            description: res.data.message,
            placement: "topRight",
          });
          handleOnNext();
        })
        .catch((error) => {
          console.log(
            "TalentsPulseStepOne -> handleOnSaveDct Error: ",
            error.response
          );
          api.error({
            message: "Erreur",
            description:
              error.response.data.message || error.response.data.error,
            placement: "topRight",
          });
        });
    }
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const yearFormatter = (value) => {
    if (value === 0) return value;
    return `${value}K€`;
  };

  const monthFormatter = (value) => {
    if (value === 0) return value;
    return `${value}00€`;
  };

  // Render
  return (
    <Spin spinning={loading} size="large" tip="Loading">
      <div className="talents-pulse-step-resume-wrapper">
        {contextHolder}
        <Title
          level={1}
          className="dct-talents-pulse-secondary text-left talents-pulse-step-title"
        >
          {title}
        </Title>
        <div className="mt-5 talents-pulse-step-resume-textarea">
          <div className="row">
            <div className="col-md-11">
              <TextArea
                name="description"
                showCount
                value={dct.description}
                maxLength={2500}
                rows={6}
                style={{ height: "250px", resize: "none" }}
                onChange={handleOnChangeStepOne}
                placeholder="Decrivez-vous en quelques mots"
              />
            </div>
            <div className="col-md-1">
              <Tooltip title="Save">
                <Button
                  type="primary"
                  shape="circle"
                  icon={<CheckOutlined />}
                  disabled={handleOnValidate()}
                  onClick={() =>
                    handleOnSaveDescription(DCT_ACTION_DESCRIPTION)
                  }
                />
              </Tooltip>
            </div>
          </div>
          <span className="dct-talents-pulse-primary">
            Minimun: 50, Maximun: 2500
          </span>
          <Divider
            orientation="left"
            className="dct-talents-pulse-secondary mt-5"
          >
            Prétentions Salariales
          </Divider>
          <div className="row">
            <div className="col-md-3">
              <label htmlFor="salaryType">
                Choix prétention
                <span className="dct-talents-pulse-field-required">*</span>
              </label>
              <Select
                style={{ width: "100%" }}
                name="salaryType"
                value={dct.salaryType}
                placeholder="Choissisez un élement"
                size="large"
                onChange={(e) => handleOnChangeStepOneSalary(e, "type")}
              >
                <Option value={HOUR}>Taux Horaire Brut</Option>
                <Option value={MONTH}>Taux Mensuel Brut</Option>
                <Option value={YEAR}>Taux Annuel Brut</Option>
              </Select>
            </div>
            {dct.salaryType === HOUR ? (
              <div className="col-md-4">
                <label htmlFor="salaryHour">
                  Tarif par heure (€)
                  <span className="dct-talents-pulse-field-required">*</span>
                </label>
                <br />
                <InputNumber
                  name="salaryHour"
                  style={{ width: "120px" }}
                  size="large"
                  value={dct.salaryHour}
                  min={0}
                  max={20}
                  defaultValue={1}
                  onChange={(e) => handleOnChangeStepOneSalary(e, "amount")}
                />
                <br />
                <i className="dct-talents-pulse-primary">Max 20€/heure</i>
              </div>
            ) : (
              <div className="col-md-4">
                <label htmlFor="salaryRange">
                  Fourchette salaire
                  <span className="dct-talents-pulse-field-required">*</span>
                </label>
                <Slider
                  name="salaryRange"
                  onChange={(e) => handleOnChangeStepOneSalary(e, "range")}
                  range
                  value={dct.salaryRange}
                  tooltip={{
                    formatter:
                      dct.salaryType === MONTH ? monthFormatter : yearFormatter,
                  }}
                  marks={dct.salaryType === MONTH ? monthMarks : yearMarks}
                />
              </div>
            )}
            <div className="col-md-1 dct-talents-pulse-space-center">
              <Tooltip title="Save">
                <Button
                  type="primary"
                  shape="circle"
                  icon={<CheckOutlined />}
                  disabled={handleOnValidateSalary()}
                  onClick={() => handleOnSaveDescription(DCT_ACTION_SALARY)}
                />
              </Tooltip>
            </div>
          </div>
        </div>

        {/* <Divider className="dct-talents-pulse-background-sliver" />
      <TalentsPulseNextPreviousStep
        dct={dct}
        steps={steps}
        current={current}
        handleOnPrevious={handleOnPrevious}
        handleOnNext={handleOnNext}
        handleOnValidate={handleOnValidate()}
      /> */}
      </div>
    </Spin>
  );
};

export default TalentsPulseStepOne;
