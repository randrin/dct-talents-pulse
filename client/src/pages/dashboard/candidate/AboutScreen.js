import React, { useEffect, useState } from "react";
import {
  Button,
  Divider,
  Input,
  Select,
  Slider,
  Spin,
  Typography,
  notification,
} from "antd";
import DashboardLayout from "../DashboardLayout";
import { dctUpdate, getDctByUser } from "../../../services/dctService";
import { talentsPulseGetToken } from "../../../utils";
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  EditOutlined,
} from "@ant-design/icons";
import {
  DCT_ACTION_DESCRIPTION_SALARY,
  MONTH,
  YEAR,
} from "../../../utils/constants";

const AboutScreen = () => {
  // States
  const [api, contextHolder] = notification.useNotification();
  const [dct, setDct] = useState({});
  const [tmpDct, setTmpDct] = useState({});
  const [loading, setLoading] = useState(false);
  const [actionEdit, setActionEdit] = useState(false);
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

  // Init
  useEffect(() => {
    if (talentsPulseGetToken()) {
      findDct();
    }
  }, []);

  // Functions
  const findDct = async () => {
    setLoading(true);
    await getDctByUser(talentsPulseGetToken())
      .then((res) => {
        setDct(res.data.dct);
        setTmpDct(res.data.dct);
      })
      .catch((error) => {
        console.log("AboutScreen -> findDct Error: ", error.response);
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

  const handleOnSaveDct = async (e) => {
    e.preventDefault();
    setLoading(true);
    await dctUpdate(dct, DCT_ACTION_DESCRIPTION_SALARY, talentsPulseGetToken())
      .then((res) => {
        console.log(res);
        setDct(res.data.dct);
        api.success({
          message: "Succès",
          description: res.data.message,
          placement: "topRight",
        });
        setActionEdit(false);
      })
      .catch((error) => {
        console.log("AboutScreen -> handleOnSaveDct Error: ", error.response);
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

  const handleOnChangeDct = (e) => {
    setDct({ ...dct, [e.target.name]: e.target.value });
  };

  const handleOnUpdateDct = () => {
    setActionEdit(!actionEdit);
  };

  const handleOnBack = () => {
    setActionEdit(!actionEdit);
    setDct(tmpDct);
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
      <DashboardLayout defaultKey={"2"} className="dct-dashboard-wrapper">
        {contextHolder}
        <div className="container-fluid">
          <Title level={2} className="text-left dct-talents-pulse-secondary">
            A' Propos de moi
          </Title>
          <Divider className="dct-talents-pulse-background-sliver dct-talents-pulse-without-margin" />
          <div className="talents-pulse-steps-wrapper container-fluid">
            <div className="talents-pulse-steps-right row">
              <div className="col talents-pulse-steps-right-content">
                <TextArea
                  className="mt-5 talents-pulse-step-resume-textarea"
                  name="description"
                  showCount
                  disabled={!actionEdit}
                  value={dct.description}
                  maxLength={2500}
                  rows={8}
                  style={{ height: "250px" }}
                  onChange={handleOnChangeDct}
                  placeholder="Decrivez-vous en quelques mots"
                />
                <span className="dct-talents-pulse-primary talents-pulse-step-resume-textarea">
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
                      <span className="dct-talents-pulse-field-required">
                        *
                      </span>
                    </label>
                    <Select
                      style={{ width: "100%" }}
                      name="salaryType"
                      value={dct.salaryType}
                      placeholder="Choissisez un élement"
                      size="large"
                      disabled={!actionEdit}
                      onChange={(e) => setDct({ ...dct, salaryType: e })}
                    >
                      <Option value={MONTH}>Net Mensuel</Option>
                      <Option value={YEAR}>Brut Annuel</Option>
                    </Select>
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="salaryRange">
                      Fourchette salaire
                      <span className="dct-talents-pulse-field-required">
                        *
                      </span>
                    </label>
                    <Slider
                      name="salaryRange"
                      onChange={(e) => setDct({ ...dct, salaryRange: e })}
                      range
                      value={dct.salaryRange}
                      tooltip={{
                        formatter:
                          dct.salaryType === MONTH
                            ? monthFormatter
                            : yearFormatter,
                      }}
                      marks={dct.salaryType === MONTH ? monthMarks : yearMarks}
                      disabled={!actionEdit}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="row mt-4 dct-talents-pulse-space-end">
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
                  <div className="col-md-2">
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
                  </div>
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
          </div>
        </div>
      </DashboardLayout>
    </Spin>
  );
};

export default AboutScreen;
