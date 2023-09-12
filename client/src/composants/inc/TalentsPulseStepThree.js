import React, { useState } from "react";
import TalentsPulseNextPreviousStep from "./TalentsPulseNextPreviousStep";
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
  Spin,
  Tooltip,
  Typography,
  notification,
} from "antd";
import TalentsPulseStepThreeDetail from "../details/TalentsPulseStepThreeDetail";
import TalentsPulseEmptyDataStep from "./TalentsPulseEmptyDataStep";
import { ACTION_EDIT, DCT_ACTION_PROJECTS } from "../../utils/constants";
import { dctUpdate } from "../../services/dctService";
import { talentsPulseGetToken } from "../../utils";

const TalentsPulseStepThree = ({
  steps,
  current,
  handleOnPrevious,
  handleOnNext,
  dct,
  setDct,
  handleOnChangeStepThree,
  title,
}) => {
  // States
  const [project, setProject] = useState({
    entitled: "",
    sector: "",
    customer: "",
  });
  const [detailIndex, setDetailIndex] = useState(0);
  const [detailMode, setDetailMode] = useState("");
  const [open, setOpen] = useState(false);
  const [showBoxProject, setShowBoxProject] = useState(false);
  const [showAddBtn, setShowAddBtn] = useState(true);
  const [loading, setLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  // Destructing
  const { Title } = Typography;
  const { entitled, sector, customer } = project;
  const { projects } = dct;

  // Functions
  const hanleOnOpenHelp = () => {
    setOpen(true);
  };

  const hanleOnCloseHelp = () => {
    setOpen(false);
  };

  const handleOnValidate = () => {
    return !!projects?.length ? false : true;
  };

  const handleOnCancelProject = () => {
    setShowAddBtn(true);
    setShowBoxProject(false);
    setProject({});
  };

  const handleOnSaveProject = () => {
    if (detailMode === ACTION_EDIT) {
      projects.map((d, index) => {
        if (index === detailIndex) {
          projects[index] = project;
        }
      });
    } else {
      handleOnChangeStepThree(project);
    }
    handleOnSaveDct();
    setShowAddBtn(true);
    setShowBoxProject(false);
    setDetailMode("");
    setProject({});
  };

  const handleOnAddProject = () => {
    setShowAddBtn(false);
    setShowBoxProject(true);
  };

  const handleOnValidateProject = () => {
    return entitled?.length >= 3 && sector?.length >= 3 && customer?.length >= 3
      ? false
      : true;
  };

  const handleOnEditStepThree = (index) => {
    setProject(projects.find((project, e) => e === index));
    setDetailIndex(index);
    setDetailMode(ACTION_EDIT);
    setShowAddBtn(false);
    setShowBoxProject(true);
  };

  const handleOnDeleteStepThree = (index) => {
    projects.map((project, e) => {
      if (index === e) {
        projects.splice(index, 1);
      }
    });
    setDct({ ...dct, projects });
    handleOnSaveDct();
  };

  const handleOnSaveDct = async () => {
    setLoading(true);
    let userDct = { ...dct, dctId: dct._id };
    await dctUpdate(userDct, DCT_ACTION_PROJECTS, talentsPulseGetToken())
      .then((res) => {
        setDct(res.data.dct);
        api.success({
          message: "Succès",
          description: res.data.message,
          placement: "topRight",
        });
        setShowAddBtn(true);
        setShowBoxProject(false);
        setProject({});
      })
      .catch((error) => {
        console.log(
          "TalentsPulseStepThree -> handleOnSaveDct Error: ",
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
      <div className="talents-pulse-step-projects-wrapper">
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
        {!showBoxProject && (
          <div className="row mt-5 talents-pulse-step-projects-container">
            {!!projects?.length ? (
              <TalentsPulseStepThreeDetail
                projects={projects}
                handleOnEditStepThree={handleOnEditStepThree}
                handleOnDeleteStepThree={handleOnDeleteStepThree}
                showActions={true}
              />
            ) : (
              <TalentsPulseEmptyDataStep
                title={"Vous n'avez aucun projet métier"}
                description={
                  "Indiquez vos diffèrents projets professionnels et secteur d'activité"
                }
                btnTitle={"Insérez un projet"}
                handleOnBtnAction={handleOnAddProject}
                showContent={!showBoxProject}
              />
            )}
          </div>
        )}
        {showBoxProject && (
          <div className="row mb-5 mt-5 dct-talents-pulse-steps-form ">
            <div className="col-md-4">
              <label htmlFor="project">
                Projet Principal
                <span className="dct-talents-pulse-field-required">*</span>
              </label>
              <Input
                name="project"
                value={entitled}
                size="large"
                onChange={(e) =>
                  setProject({ ...project, entitled: e.target.value })
                }
                placeholder="Entrez le nom du projet"
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="sector">
                Secteur d'activité
                <span className="dct-talents-pulse-field-required">*</span>
              </label>
              <Input
                name="sector"
                value={sector}
                size="large"
                onChange={(e) =>
                  setProject({ ...project, sector: e.target.value })
                }
                placeholder="Industrie, Média, Automobile, ..."
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="customer">
                Client
                <span className="dct-talents-pulse-field-required">*</span>
              </label>
              <Input
                name="customer"
                value={customer}
                size="large"
                onChange={(e) =>
                  setProject({ ...project, customer: e.target.value })
                }
                placeholder="talents-pulse Sarl"
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
                  onClick={handleOnCancelProject}
                />
              </Tooltip>
              <Tooltip title="Save">
                <Button
                  type="primary"
                  shape="circle"
                  icon={<CheckOutlined />}
                  disabled={handleOnValidateProject()}
                  onClick={handleOnSaveProject}
                />
              </Tooltip>
            </div>
          </div>
        )}
        {showAddBtn && !!projects.length && (
          <Button
            type="dashed"
            size="large"
            onClick={handleOnAddProject}
            className="mb-4 mt-4 talents-pulse-standard-title talents-pulse-btn-add"
          >
            <PlusOutlined /> Ajouter un project
          </Button>
        )}
        <Drawer
          title="Comment remplir les compétences clés"
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

export default TalentsPulseStepThree;
