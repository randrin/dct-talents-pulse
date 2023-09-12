import React, { useState } from "react";
import DashboardLayout from "../../DashboardLayout";
import { Button, Divider, Spin, notification } from "antd";
import { END_POINT_DASHBOARD_DCTS } from "../../../../routers/end-points";
import { ArrowLeftOutlined, CloudDownloadOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { dctDownload, getDctById } from "../../../../services/dctService";
import { talentsPulseGetToken } from "../../../../utils";
import TalentsPulseStepSummary from "../../../../composants/inc/TalentsPulseStepSummary";

const ViewDctScreen = () => {
  // States
  const [api, contextHolder] = notification.useNotification();
  const [dct, setDct] = useState({});
  const navigate = useNavigate();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const dctId = params._id.split("=")[1];

  // Init
  useEffect(() => {
    if (dctId) {
      findDct(dctId);
    }
  }, []);

  // Functions
  const findDct = async (id) => {
    setLoading(true);
    await getDctById(id, talentsPulseGetToken())
      .then((res) => {
        setDct(res.data.dct);
      })
      .catch((error) => {
        console.log("ViewDctScreen -> findDct Error: ", error.response);
        api.error({
          message: "Erreur",
          description: error.response.data.message || error.response.data.error,
          placement: "topRight",
        });
      });
    setLoading(false);
  };

  const handleOnDownload = async () => {
    setLoading(true);
    await dctDownload(dctId, talentsPulseGetToken())
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
        console.log(
          "ViewDctScreen -> handleOnDownload Error: ",
          error.response
        );
        api.error({
          message: "Erreur",
          description: error.response.data.message || error.response.data.error,
          placement: "topRight",
        });
      });
    setLoading(false);
  };

  const handleOnValidateDct = () => {
    const { description, skills, projectsDetail, formations, linguistics } =
      dct;
    return !!description?.length &&
      !!skills?.length &&
      !!projectsDetail?.length &&
      !!formations?.length &&
      !!linguistics?.length
      ? true
      : false;
  };

  // Render
  return (
    <Spin spinning={loading} size="large" tip="Loading">
      <DashboardLayout>
        {contextHolder}
        <div className="dct-talents-pulse-space-between">
          <Button
            onClick={() => navigate(END_POINT_DASHBOARD_DCTS)}
            type="primary"
            size="large"
            className="float-left dct-talents-pulse-btn-outline-tomato"
          >
            <ArrowLeftOutlined /> Allez sur les Dcts
          </Button>
          {handleOnValidateDct() && (
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
        <Divider className="dct-talents-pulse-background-sliver" />
        <div className="talents-pulse-steps-wrapper container-fluid">
          <div className="talents-pulse-steps-right row">
            <div className="col talents-pulse-steps-right-content">
              <TalentsPulseStepSummary dct={dct} showSteps={false} />
            </div>
          </div>
        </div>
      </DashboardLayout>
    </Spin>
  );
};

export default ViewDctScreen;
