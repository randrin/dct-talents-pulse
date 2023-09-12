import React, { useEffect, useState } from "react";
import { Button, Divider, Spin, Typography, notification } from "antd";
import TalentsPulseStepSummary from "../../../composants/inc/TalentsPulseStepSummary";
import { talentsPulseGetToken, talentsPulseGetUser } from "../../../utils";
import { dctDownload, getDctByUser } from "../../../services/dctService";
import DashboardLayout from "../DashboardLayout";
import { useNavigate } from "react-router-dom";
import { END_POINT_PROFILE_COMPLETED } from "../../../routers/end-points";
import { CloudDownloadOutlined } from "@ant-design/icons";

const DashboardCandidateScreen = () => {
  // States
  const [api, contextHolder] = notification.useNotification();
  const [dct, setDct] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Destructing
  const { Title } = Typography;
  const { matricule } = dct;

  // Init
  useEffect(() => {
    if (talentsPulseGetToken()) {
      if (talentsPulseGetUser()?.emailVerified) {
        findDct();
      } else {
        navigate(END_POINT_PROFILE_COMPLETED);
      }
    }
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
          "DashboardCandidateScreen -> findDct Error: ",
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

  const handleOnDownload = async () => {
    setLoading(true);
    await dctDownload(dct._id, talentsPulseGetToken())
      .then((res) => {
        const nodeJSBuffer = res.data.doc;
        const buffer = Buffer.from(nodeJSBuffer);
        const blob = new Blob([buffer]);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        a.target = "_self";
        a.href = url;
        a.download = `${res.data.dct.user.firstName} ${res.data.dct.user.lastName}.docx`;
        a.click();
        window.URL.revokeObjectURL(url);
        api.success({
          message: "Success",
          description: res.data.message,
          placement: "topRight",
        });
      })
      .catch((error) => {
        console.log("DctsScreen -> handleOnDownload Error: ", error.response);
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
      {contextHolder}
      <DashboardLayout defaultKey={"1"} className="dct-dashboard-wrapper">
        <div className="container-fluid">
          <div className="row">
            <div className="col dct-talents-pulse-space-between">
              <Title
                level={2}
                className="text-left dct-talents-pulse-secondary"
              >
                Mon Talents Pulse DCT
              </Title>
              {matricule && (
                <Button
                  onClick={handleOnDownload}
                  type="primary"
                  size="large"
                  className="float-left dct-talents-pulse-btn-secondary"
                >
                  <CloudDownloadOutlined /> Download DCT
                </Button>
              )}
            </div>
          </div>
          <Divider className="dct-talents-pulse-background-sliver dct-talents-pulse-without-margin" />
          <div className="talents-pulse-steps-wrapper container-fluid">
            <div className="talents-pulse-steps-right row">
              <div className="col talents-pulse-steps-right-content">
                <TalentsPulseStepSummary dct={dct} showSteps={false} />
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </Spin>
  );
};

export default DashboardCandidateScreen;
