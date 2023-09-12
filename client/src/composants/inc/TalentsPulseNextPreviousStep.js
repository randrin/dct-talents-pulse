import React, { useEffect, useState } from "react";
import {
  RightOutlined,
  LeftOutlined,
  FileWordOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import { Button, Modal, Spin, notification } from "antd";
import { dctDownload } from "../../services/dctService";
import { talentsPulseGetToken } from "../../utils";

const TalentsPulseNextPreviousStep = ({
  dct,
  steps,
  current,
  handleOnPrevious,
  handleOnNext,
  handleOnValidate,
}) => {
  // States
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);

  // Init
  useEffect(() => {}, []);

  // Destructing
  const { confirm } = Modal;
  const {
    dctId,
    description,
    skills,
    projects,
    projectsDetail,
    formations,
    tecnicalSkills,
    linguistics,
    matricule,
  } = dct;

  // Functions
  const contentTextModal = () => (
    <span style={{ fontSize: "16px" }}>
      Vous êtes sur le point de générer votre dossier de compétences techniques
      au format word avec les données saissies. Une fois cliqué sur le bouton{" "}
      <b className="dct-talents-pulse-primary">Générer</b>, vous pouvez
      retrouver votre dossier <b>{matricule + ".docx"}</b> dans le fichier de
      téléchargement de votre Pc.
    </span>
  );

  const titleTextModal = () => (
    <span style={{ fontSize: "22px" }}>Confirmation DCT</span>
  );

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
          "TalentsPulseNextPreviousStep -> handleOnDownload Error: ",
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

  const handleOnValidateSummary = () => {
    return !!description?.length &&
      !!skills?.length &&
      !!projectsDetail?.length &&
      !!formations?.length &&
      !!linguistics?.length
      ? false
      : true;
  };

  const handleOnConfirmGenerateWord = async () => {
    confirm({
      title: titleTextModal(),
      icon: <ExclamationCircleFilled />,
      centered: true,
      okText: "Générer",
      cancelText: "Non",
      content: contentTextModal(),
      onOk() {
        handleOnDownload();
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  return (
    <Spin spinning={loading} size="large" tip="Loading">
      {contextHolder}
      <div className="row talents-pulse-steps-right-cta">
        <div className="col">
          {current > 0 && (
            <Button
              className="dct-talents-pulse-btn-tomato float-left"
              type="primary"
              size="large"
              shape="round"
              danger
              onClick={() => handleOnPrevious()}
            >
              <LeftOutlined /> Précédent
            </Button>
          )}
          {current < steps.length - 1 ? (
            <Button
              className="dct-talents-pulse-btn-secondary float-right"
              type="primary"
              size="large"
              shape="round"
              onClick={() => handleOnNext()}
              disabled={handleOnValidate}
            >
              Suivant <RightOutlined />
            </Button>
          ) : (
            <Button
              className="dct-talents-pulse-btn-secondary float-right"
              type="primary"
              size="large"
              shape="round"
              onClick={() => handleOnConfirmGenerateWord()}
              disabled={handleOnValidateSummary()}
            >
              <FileWordOutlined /> DCT in Word Format
            </Button>
          )}
        </div>
      </div>
    </Spin>
  );
};

export default TalentsPulseNextPreviousStep;
