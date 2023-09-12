import React, { useEffect, useState } from "react";
import DashboardLayout from "../DashboardLayout";
import {
  Button,
  Divider,
  Input,
  Spin,
  Tooltip,
  Typography,
  notification,
} from "antd";
import { dctUpdate, getDctByUser } from "../../../services/dctService";
import { talentsPulseGetToken } from "../../../utils";
import TalentsPulseStepThreeDetail from "../../../composants/details/TalentsPulseStepThreeDetail";
import TalentsPulseEmptyDataStep from "../../../composants/inc/TalentsPulseEmptyDataStep";
import {
  ArrowLeftOutlined,
  CheckOutlined,
  EditOutlined,
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { ACTION_EDIT, DCT_ACTION_PROJECTS } from "../../../utils/constants";

const ProjectsScreen = () => {
  // States
  const [api, contextHolder] = notification.useNotification();
  const [dct, setDct] = useState({});
  const [project, setProject] = useState({
    entitled: "",
    sector: "",
    customer: "",
  });
  const [loading, setLoading] = useState(false);
  const [actionEdit, setActionEdit] = useState(false);
  const [detailIndex, setDetailIndex] = useState(0);
  const [isEmptyData, setIsEmptyData] = useState(false);
  const [detailMode, setDetailMode] = useState("");
  const [showBoxProject, setShowBoxProject] = useState(false);
  const [showAddBtn, setShowAddBtn] = useState(false);

  // Destructing
  const { Title } = Typography;
  const { entitled, sector, customer } = project;
  const { projects } = dct;

  // Init
  useEffect(() => {
    findDct();
  }, []);

  // Functions
  const findDct = async () => {
    setLoading(true);
    await getDctByUser(talentsPulseGetToken())
      .then((res) => {
        setDct(res.data.dct);
      })
      .catch((error) => {
        console.log("ProjectsScreen -> findDct Error: ", error.response);
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
      handleOnChangeDct(project);
    }
    handleOnSaveDct();
    setShowAddBtn(true);
    setShowBoxProject(false);
    setDetailMode("");
    setActionEdit(true);
    setProject({});
  };

  const handleOnChangeDct = (e) => {
    projects?.push(e);
    setDct({
      ...dct,
      projects,
    });
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
    handleOnSaveDct();
    setDct({ ...dct, projects });
    setIsEmptyData(!!projects?.length ? false : true);
    setActionEdit(true);
  };

  const handleOnUpdateDct = () => {
    setActionEdit(!actionEdit);
    setShowAddBtn(!showAddBtn);
  };

  const handleOnBack = () => {
    setActionEdit(!actionEdit);
    setShowAddBtn(false);
    setShowBoxProject(false);
    setProject({});
    findDct();
  };

  const handleOnSaveDct = async () => {
    setLoading(true);
    await dctUpdate(dct, DCT_ACTION_PROJECTS, talentsPulseGetToken())
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
        setShowBoxProject(false);
        setProject({});
      })
      .catch((error) => {
        console.log(
          "ProjectsScreen -> handleOnSaveDct Error: ",
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
      <DashboardLayout defaultKey={"4"} className="dct-dashboard-wrapper">
        {contextHolder}
        <div className="container-fluid">
          <Title level={2} className="text-left dct-talents-pulse-secondary">
            Principaux Projets
          </Title>
          <Divider className="dct-talents-pulse-background-sliver" />
          {!showBoxProject && (
            <div className="row mt-5 talents-pulse-step-projects-container">
              {!!projects?.length ? (
                <TalentsPulseStepThreeDetail
                  projects={projects}
                  handleOnEditStepThree={handleOnEditStepThree}
                  handleOnDeleteStepThree={handleOnDeleteStepThree}
                  showActions={actionEdit}
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
                  placeholder="Talents Pulse"
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
          {showAddBtn && (!!projects?.length || isEmptyData) && (
            <Button
              type="dashed"
              size="large"
              onClick={handleOnAddProject}
              className="mb-4 mt-4 talents-pulse-standard-title talents-pulse-btn-add"
            >
              <PlusOutlined /> Ajouter un project
            </Button>
          )}
          {(!!projects?.length || isEmptyData) && (
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

export default ProjectsScreen;
