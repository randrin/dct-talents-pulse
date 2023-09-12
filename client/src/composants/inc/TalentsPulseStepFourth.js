import React, { useEffect, useState } from "react";
import {
  Button,
  Collapse,
  DatePicker,
  Divider,
  Drawer,
  Input,
  Tag,
  Tooltip,
  Typography,
  Modal,
  Alert,
  notification,
  Spin,
} from "antd";
import {
  QuestionCircleOutlined,
  PlusOutlined,
  MinusOutlined,
  CheckOutlined,
  EditFilled,
  DeleteFilled,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import TalentsPulseNextPreviousStep from "./TalentsPulseNextPreviousStep";
import moment from "moment/moment";
import dayjs from "dayjs";
import TalentsPulseStepFourthDetail from "../details/TalentsPulseStepFourthDetail";
import TalentsPulseEmptyDataStep from "./TalentsPulseEmptyDataStep";
import {
  ACTION_EDIT,
  DCT_ACTION_PROJECTS_DETAIL,
  FORMAT_MONTH_FORMAT,
} from "../../utils/constants";
import { talentsPulseGetToken } from "../../utils";
import { dctUpdate } from "../../services/dctService";

const TalentsPulseStepFourth = ({
  steps,
  current,
  handleOnPrevious,
  handleOnNext,
  dct,
  setDct,
  handleOnChangeStepFourth,
  title,
  handleOnCancelStepDct,
}) => {
  // States
  const [project, setProject] = useState({
    startDate: "",
    endDate: "",
    position: "",
    customer: "",
    projectTitle: "",
    achievements: [],
    technicalEnvironment: [],
    technicalEnvironmentFormat: "",
  });
  const [detailProjectIndex, setDetailProjectIndex] = useState(0);
  const [detailAchievementIndex, setDetailAchievementIndex] = useState(0);
  const [detailMode, setDetailMode] = useState("");
  const [achievement, setAchievement] = useState("");
  const [open, setOpen] = useState(false);
  const [showBoxProject, setShowBoxProject] = useState(false);
  const [showBoxAchiement, setShowBoxAchiement] = useState(false);
  const [showAddBtn, setShowAddBtn] = useState(true);
  const [showAddAchiementBtn, setShowAddAchiementBtn] = useState(true);
  const [showInputTag, setShowInputTag] = useState(false);
  const [tag, setTag] = useState("");
  const [isNewProject, setIsNewProject] = useState(false);
  const [actionEdit, setActionEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  // Destructing
  const { Title, Paragraph } = Typography;
  const { TextArea } = Input;
  const { Panel } = Collapse;
  const { confirm } = Modal;
  const { RangePicker } = DatePicker;
  const {
    startDate,
    endDate,
    position,
    customer,
    projectTitle,
    achievements,
    technicalEnvironment,
  } = project;
  const { projectsDetail } = dct;

  // Init
  const monthFormat = FORMAT_MONTH_FORMAT;
  useEffect(() => {
    handleOnInitDates();
  }, []);

  // Functions
  const handleOnInitDates = () => {
    const currentDate = moment(new Date()).format(monthFormat);
    setProject({ ...project, startDate: currentDate, endDate: currentDate });
  };
  const hanleOnOpenHelp = () => {
    setOpen(true);
  };

  const hanleOnCloseHelp = () => {
    setOpen(false);
  };

  const handleOnValidate = () => {
    return !!projectsDetail?.length ? false : true;
  };

  const handleOnCancelProject = () => {
    setShowAddBtn(true);
    setShowBoxProject(false);
    setActionEdit(true);
    setProject({
      startDate: "",
      endDate: "",
      position: "",
      customer: "",
      projectTitle: "",
      achievements: [],
      technicalEnvironment: [],
      technicalEnvironmentFormat: "",
    });
    setAchievement("");
    setDetailProjectIndex(0);
    setIsNewProject(false);
    handleOnCancelStepDct();
  };

  const handleOnSaveProject = () => {
    if (!isNewProject) {
      projectsDetail?.map((d, index) => {
        if (index === detailProjectIndex) {
          projectsDetail[index] = project;
        }
      });
    } else {
      handleOnChangeStepFourth(project);
    }
    handleOnSaveDct();
  };

  const handleOnSaveDct = async () => {
    setLoading(true);
    let userDct = { ...dct, dctId: dct._id };
    await dctUpdate(userDct, DCT_ACTION_PROJECTS_DETAIL, talentsPulseGetToken())
      .then((res) => {
        setDct(res.data.dct);
        api.success({
          message: "Succès",
          description: res.data.message,
          placement: "topRight",
        });
        setActionEdit(false);
        setShowAddBtn(true);
        setShowBoxProject(false);
        setAchievement("");
        setDetailMode("");
        setProject({
          startDate: "",
          endDate: "",
          position: "",
          customer: "",
          projectTitle: "",
          achievements: [],
          technicalEnvironment: [],
          technicalEnvironmentFormat: "",
        });
      })
      .catch((error) => {
        console.log(
          "TalentsPulseStepFourth -> handleOnSaveDct Error: ",
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

  const handleOnAddProject = () => {
    setShowAddBtn(false);
    setShowBoxProject(true);
    handleOnInitDates();
    setDetailMode("");
    setIsNewProject(true);
  };

  const handleOnAddAchievement = () => {
    setShowBoxAchiement(true);
    setShowAddAchiementBtn(false);
    setDetailMode("");
  };

  const handleOnCancelAchievement = () => {
    setShowAddAchiementBtn(true);
    setShowBoxAchiement(false);
    setAchievement("");
    setActionEdit(true);
  };

  const handleOnSaveAchievement = () => {
    if (detailMode === ACTION_EDIT) {
      achievements?.map((d, index) => {
        if (index === detailAchievementIndex) {
          achievements[index].title = achievement;
        }
      });
    } else {
      achievements?.push({ title: achievement });
    }
    setProject({ ...project, achievements });
    handleOnCancelAchievement();
  };

  const handleOnValidateAchievement = () => {
    return achievement?.length >= 5 ? false : true;
  };

  const handleOnSaveTag = () => {
    technicalEnvironment?.push(tag);
    const technicalEnvironmentJoin = technicalEnvironment
      ?.map((environment, index) => environment)
      ?.join(", ");
    setProject({
      ...project,
      technicalEnvironment,
      technicalEnvironmentFormat: technicalEnvironmentJoin,
    });
    setShowInputTag(false);
  };

  const handleOnCancelTag = () => {
    setShowInputTag(false);
  };

  const handleOnAddTag = () => {
    setShowInputTag(true);
  };

  const handleOnDeleteTag = (e) => {
    technicalEnvironment?.map((tag, index) => {
      if (index === e) {
        technicalEnvironment.splice(index, 1);
      }
    });
    const technicalEnvironmentJoin = technicalEnvironment
      ?.map((environment, index) => environment)
      ?.join(", ");
    setProject({
      ...project,
      technicalEnvironment,
      technicalEnvironmentFormat: technicalEnvironmentJoin,
    });
  };

  const handleOnValidateProject = () => {
    return !!startDate?.length &&
      !!endDate?.length &&
      position?.length >= 3 &&
      customer?.length >= 3 &&
      !!achievements?.length
      ? false
      : true;
  };

  const onChange = (key) => {
    console.log(key);
  };

  const handleOnEditStepFourth = (index) => {
    setProject(projectsDetail.find((project, e) => e === index));
    setDetailProjectIndex(index);
    setDetailMode(ACTION_EDIT);
    setShowAddBtn(false);
    setShowBoxProject(true);
    setActionEdit(true);
    setIsNewProject(false);
  };

  const handleOnGenerateExtra = (index) => (
    <>
      <span className="dct-talents-pulse-cta-action">
        <EditFilled
          className="dct-talents-pulse-secondary"
          onClick={(event) => {
            // If you don't want click extra trigger collapse, you can prevent this:
            console.log("EditFilled: ", index);
            handleOnEditStepFourth(index);
            event.stopPropagation();
          }}
        />
      </span>
      <span className="dct-talents-pulse-cta-action ml-3">
        <DeleteFilled
          className="dct-talents-pulse-tomato"
          onClick={(event) => {
            // If you don't want click extra trigger collapse, you can prevent this:
            event.stopPropagation();
            handleOnShowConfirm(index);
          }}
        />
      </span>
    </>
  );

  const contentTextModal = () => (
    <span style={{ fontSize: "16px" }}>
      Une fois cliqué sur le boutton{" "}
      <b className="dct-talents-pulse-primary">
        <i>OUI</i>
      </b>
      , les données saissies de votre projet seront perdus et vous deviez
      récommencer à nouveau.
    </span>
  );

  const titleTextModal = () => (
    <span style={{ fontSize: "22px" }}>Voulez-vous supprimer ce projet?</span>
  );

  const handleOnShowConfirm = (index) => {
    confirm({
      title: titleTextModal(),
      icon: <ExclamationCircleFilled />,
      okText: "Oui",
      cancelText: "Non",
      content: contentTextModal(),
      onOk() {
        projectsDetail.map((project, e) => {
          if (index === e) {
            projectsDetail.splice(index, 1);
          }
        });
        setDct({ ...dct, projectsDetail });
        handleOnSaveDct();
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const handleOnEditAchievement = (index) => {
    console.log("attachement index: ", index);
    setDetailAchievementIndex(index);
    achievements?.map((a, e) => {
      if (index === e) {
        setAchievement(a?.title);
      }
    });
    setShowBoxAchiement(true);
    setDetailMode(ACTION_EDIT);
  };

  const handleOnDeleteAchievement = (index) => {
    achievements?.map((a, e) => {
      if (index === e) {
        achievements?.splice(index, 1);
      }
    });
    setProject({ ...project, achievements });
    setDetailMode("");
    setShowBoxAchiement(false);
  };

  // Render
  return (
    <Spin spinning={loading} size="large" tip="Loading">
      <div className="talents-pulse-step-projects-detail-wrapper">
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
          <div className="row mt-5 talents-pulse-step-projects-detail-container">
            <div className="col-md-12">
              {!!projectsDetail.length ? (
                <Collapse defaultActiveKey={["0"]} onChange={onChange}>
                  {projectsDetail?.map((project, index) => (
                    <Panel
                      header={`${
                        project?.startDate.split("/")[0] +
                        "/" +
                        project?.startDate.split("/")[1]
                      } - ${
                        project?.endDate.split("/")[0] +
                        "/" +
                        project?.endDate.split("/")[1]
                      } : ${project?.position} - ${project?.customer}`}
                      key={index}
                      className="talents-pulse-standard-title"
                      extra={handleOnGenerateExtra(index)}
                    >
                      <TalentsPulseStepFourthDetail project={project} />
                    </Panel>
                  ))}
                </Collapse>
              ) : (
                <TalentsPulseEmptyDataStep
                  title={"Vous n'avez aucun projet métier"}
                  description={
                    "Détaillez vos diffèrents projets professionnels et réalisations"
                  }
                  btnTitle={"Insérez un projet"}
                  handleOnBtnAction={handleOnAddProject}
                  showContent={!showBoxProject}
                />
              )}
            </div>
          </div>
        )}
        {showBoxProject && (
          <div className="mt-5 mb-5 dct-talents-pulse-steps-form talents-pulse-step-projects-detail-form">
            <div className="row mb-4">
              <div className="col-md-4">
                <label htmlFor="startDate">
                  De - A
                  <span className="dct-talents-pulse-field-required">*</span>
                </label>
                <RangePicker
                  defaultValue={[
                    dayjs(startDate, monthFormat),
                    dayjs(endDate, monthFormat),
                  ]}
                  style={{ width: "100%" }}
                  size={"large"}
                  picker="month"
                  format={monthFormat}
                  aria-valuemax={startDate}
                  aria-valuemin={endDate}
                  onChange={(date, dateString) =>
                    setProject({
                      ...project,
                      startDate: dateString[0],
                      endDate: dateString[1],
                    })
                  }
                  disabledDate={(current) =>
                    current && current.valueOf() > moment().subtract(1, "days")
                  }
                />
              </div>
              <div className="col-md-5">
                <label htmlFor="position">
                  Position occupée
                  <span className="dct-talents-pulse-field-required">*</span>
                </label>
                <Input
                  name="position"
                  value={position}
                  size="large"
                  onChange={(e) =>
                    setProject({ ...project, position: e.target.value })
                  }
                  placeholder="Ingénieur Informatique, Aéronautique, ..."
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
                  placeholder="Nom du client"
                />
              </div>
            </div>
            <div className="row mb-4">
              <div className="col">
                <label htmlFor="projectTitle">Intitulé du projet</label>
                <Input
                  name="projectTitle"
                  value={projectTitle}
                  size="large"
                  onChange={(e) =>
                    setProject({ ...project, projectTitle: e.target.value })
                  }
                  placeholder="Entrez le nom du projet"
                />
              </div>
            </div>
            <div className="row mb-4">
              <div className="col-md-12 font-weight-bold talents-pulse-standard-title ">
                Réalisations effectuées:{" "}
                <span className="dct-talents-pulse-field-required">*</span>
              </div>
              <div className="col-md-12">
                {!!achievements?.length && (
                  <div className="row mt-3 ml-4 talents-pulse-step-projects-detail-achievements">
                    {achievements?.map((element, index) => (
                      <div
                        key={index}
                        className="col-md-12 talents-pulse-step-projects-detail-achievement"
                      >
                        <span className="talents-pulse-step-project-detail-achievement-item talents-pulse-standard-title">
                          <div className="row talents-pulse-step-project-detail-achievement-item-container">
                            <div className="col-md-11">
                              <span>{element?.title}</span>
                            </div>
                            <div className="col-md-1">
                              {actionEdit && (
                                <div className="talents-pulse-step-project-detail-achievement-cta">
                                  <span className="talents-pulse-step-project-detail-achievement-cta-item">
                                    <EditFilled
                                      className="dct-talents-pulse-secondary"
                                      onClick={() =>
                                        handleOnEditAchievement(index)
                                      }
                                    />
                                  </span>
                                  <span className="talents-pulse-step-project-detail-achievement-cta-item">
                                    <DeleteFilled
                                      className="dct-talents-pulse-tomato"
                                      onClick={() =>
                                        handleOnDeleteAchievement(index)
                                      }
                                    />
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                {showBoxAchiement && (
                  <div className="row mt-3">
                    <div className="col-md-11">
                      <Alert
                        message="Insérez une à une les réalisations effectuées, puis validez. Ne pas commencez avec les caractéres spéciaux comme *, -, ▪, •, “, ”, ⮚, etc ..."
                        type="info"
                        showIcon
                      />
                      <br />
                      <Paragraph className="dct-talents-pulse-tomato dct-talents-pulse-without-margin">
                        <i>
                          <b>Minimun 5 mots pour valider la réalisation</b>
                        </i>
                      </Paragraph>
                      <TextArea
                        name="achievement"
                        showCount
                        value={achievement}
                        rows={4}
                        style={{ resize: "none" }}
                        onChange={(e) => setAchievement(e.target.value)}
                        placeholder="Détaillez la réalisation"
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
                          onClick={handleOnCancelAchievement}
                        />
                      </Tooltip>
                      <Tooltip title="Save">
                        <Button
                          type="primary"
                          shape="circle"
                          icon={<CheckOutlined />}
                          disabled={handleOnValidateAchievement()}
                          onClick={handleOnSaveAchievement}
                        />
                      </Tooltip>
                    </div>
                  </div>
                )}
                {showAddAchiementBtn && (
                  <Button
                    type="dashed"
                    size="large"
                    onClick={handleOnAddAchievement}
                    className="mb-4 mt-4 talents-pulse-standard-title talents-pulse-btn-add"
                  >
                    <PlusOutlined /> Ajouter une réalisation
                  </Button>
                )}
              </div>
            </div>
            <div className="row mb-4">
              <div className="col-md-12 font-weight-bold talents-pulse-step-projects-detail-environement">
                <div className="row">
                  <div className="col-md-5 talents-pulse-step-projects-detail-environement-title talents-pulse-standard-title">
                    Environnement techniques:
                  </div>
                  <div className="col-md-7 d-flex">
                    <div className="row">
                      <div className="col-md-12 talents-pulse-step-projects-detail-environement-container-tag">
                        {technicalEnvironment?.length !== 0 &&
                          technicalEnvironment?.map((t, index) => (
                            <div
                              key={index}
                              className="talents-pulse-step-projects-detail-environement-item"
                            >
                              <Tag
                                color="#00b5ec"
                                closable
                                style={{ padding: "8px", fontSize: "15px" }}
                                onClose={() => handleOnDeleteTag(index)}
                              >
                                {t}
                              </Tag>
                            </div>
                          ))}
                        {showInputTag ? (
                          <Input
                            size="large"
                            placeholder="Catia v5, Jira, Confluence"
                            style={{ width: "50%", height: "40px" }}
                            onChange={(e) => setTag(e.target.value)}
                            onPressEnter={handleOnSaveTag}
                            onBlur={handleOnCancelTag}
                            onAbort={handleOnCancelTag}
                          />
                        ) : (
                          <Button
                            type="dashed"
                            size="large"
                            onClick={handleOnAddTag}
                          >
                            <PlusOutlined /> New tag
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Divider className="dct-talents-pulse-background-sliver" />
            <div className="row mb-2">
              <div className="col dct-talents-pulse-form-cta">
                <i>
                  Veuillez{" "}
                  <span className="dct-talents-pulse-tomato font-weight-bold">
                    Annuler
                  </span>{" "}
                  ou{" "}
                  <span className="dct-talents-pulse-secondary font-weight-bold">
                    Confirmer{" "}
                  </span>
                  votre project
                </i>
              </div>
            </div>
            <div className="row mb-4">
              <div className="col dct-talents-pulse-form-cta">
                <Tooltip title="Cancel">
                  <Button
                    className="mr-3 dct-talents-pulse-btn-tomato"
                    type="primary"
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
          </div>
        )}
        {showAddBtn && !!projectsDetail.length && (
          <Button
            type="dashed"
            size="large"
            onClick={handleOnAddProject}
            className="mb-4 mt-4 talents-pulse-standard-title talents-pulse-btn-add"
          >
            <PlusOutlined /> Détailler un project
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
        <div className="talents-pulse-steps-bottom-cta">
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
      </div>
    </Spin>
  );
};

export default TalentsPulseStepFourth;
