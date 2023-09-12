import React, { useState } from "react";
import { Button, Input, Spin, Tooltip, Typography, notification } from "antd";
import TalentsPulseNextPreviousStep from "./TalentsPulseNextPreviousStep";
import { CheckOutlined } from "@ant-design/icons";
import { talentsPulseGetToken } from "../../utils";
import { DCT_ACTION_DESCRIPTION } from "../../utils/constants";
import { dctUpdate } from "../../services/dctService";

const TalentsPulseStepOne = ({
  steps,
  current,
  handleOnPrevious,
  handleOnNext,
  dct,
  setDct,
  handleOnChangeStepOne,
  title,
}) => {
  // States
  const [loading, setLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  // Destructing
  const { Title } = Typography;
  const { TextArea } = Input;

  // Functions
  const handleOnValidate = () => {
    return dct?.description?.length >= 50 ? false : true;
  };

  const handleOnSaveSkill = async () => {
    setLoading(true);
    let userDct = { ...dct, dctId: dct._id };
    await dctUpdate(userDct, DCT_ACTION_DESCRIPTION, talentsPulseGetToken())
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
                rows={8}
                style={{ height: "300px", resize: "none" }}
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
                  onClick={handleOnSaveSkill}
                />
              </Tooltip>
            </div>
          </div>
        </div>
        <span className="dct-talents-pulse-primary talents-pulse-step-resume-textarea">
          Minimun: 50, Maximun: 2500
        </span>
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
