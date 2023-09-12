import React, { useEffect, useState } from "react";
import { Button, Divider, Modal, notification, Spin, Steps } from "antd";
import TalentsPulseStepOne from "../../../composants/inc/TalentsPulseStepOne";
import TalentsPulseStepTwo from "../../../composants/inc/TalentsPulseStepTwo";
import TalentsPulseStepThree from "../../../composants/inc/TalentsPulseStepThree";
import TalentsPulseStepFourth from "../../../composants/inc/TalentsPulseStepFourth";
import TalentsPulseStepFive from "../../../composants/inc/TalentsPulseStepFive";
import TalentsPulseStepSix from "../../../composants/inc/TalentsPulseStepSix";
import TalentsPulseStepSeven from "../../../composants/inc/TalentsPulseStepSeven";
import TalentsPulseStepSummary from "../../../composants/inc/TalentsPulseStepSummary";
import {
  ArrowLeftOutlined,
  ClearOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  END_POINT_DASHBOARD,
  END_POINT_DASHBOARD_DCTS,
} from "../../../routers/end-points";
import DashboardLayout from "../DashboardLayout";
import {
  activityDelete,
  getListActivities,
} from "../../../services/activityService";
import { ACTION_EDIT, ACTIVITY_CREATE_DCT } from "../../../utils/constants";
import { talentsPulseGetToken } from "../../../utils";
import { dctUpdateMatricule } from "../../../services/dctService";

const StepsDctScreen = ({ mode, userDct, handleOnCancelStepDct }) => {
  // States
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();
  const [dct, setDct] = useState({
    dctId: "",
    expertise: "",
    description: "",
    skills: [],
    projects: [],
    projectsDetail: [],
    formations: [],
    tecnicalSkills: [],
    linguistics: [],
    matricule: "",
  });
  const [activity, setActivity] = useState({
    activityType: "",
    user: "",
    dct: "",
  });
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);

  // Destructing
  const {
    dctId,
    description,
    skills,
    projects,
    projectsDetail,
    formations,
    tecnicalSkills,
    linguistics,
  } = dct;
  const { confirm } = Modal;

  // Init
  useEffect(() => {
    if (mode === ACTION_EDIT) {
      setDct({
        ...userDct,
        dctId: userDct._id,
      });
    } else {
      getListActivityMember();
      handleOnCheckCurrentStep();
    }
  }, [userDct]);

  const handleOnCheckCurrentStep = () => {
    if (!description?.length) {
      console.log("step 0");
      setCurrent(0);
    } else if (!skills?.length) {
      console.log("step 1");
      setCurrent(1);
    } else if (!projectsDetail?.length) {
      console.log("step 2");
      setCurrent(2);
    } else if (!formations?.length) {
      console.log("step 3");
      setCurrent(3);
    } else if (!linguistics?.length) {
      console.log("step 4");
      setCurrent(4);
    } else {
      setCurrent(5);
    }
  };

  const steps = [
    {
      key: 0,
      title: "Motivation",
      description: "Une petite description de vous",
    },
    {
      key: 1,
      title: "Compétences",
      description: "Vos points forts",
      // disabled: !!skills?.length ? false : true,
    },
    {
      key: 2,
      title: "Expériences",
      description: "Diffèrents projets détaillés",
      // disabled: !!projects?.length ? false : true,
    },
    {
      key: 3,
      title: "Informations et Diplômes",
      description: "Votre parcours academique",
      // disabled: !!projectsDetail?.length ? false : true,
    },
    {
      key: 4,
      title: "Acquis Linguistiques",
      description: "Maitrise de comunication",
      // disabled: !!formations?.length ? false : true,
    },
    // {
    //   key: 5,
    //   title: "Acquis Techniques",
    //   description: "Maitrise des logiciels",
    //   // disabled: !!tecnicalSkills?.length ? false : true,
    // },
    // {
    //   key: 6,
    //   title: "Acquis Linguistiques",
    //   description: "Maitrise de comunication",
    //   // disabled: !!linguistics?.length ? false : true,
    // },
    {
      key: 5,
      title: "Sommaire",
      description: "Votre DCT",
      // disabled:
      //   !!skills?.length &&
      //   !!projects?.length &&
      //   !!projectsDetail?.length &&
      //   !!formations?.length &&
      //   !!tecnicalSkills?.length &&
      //   !!linguistics?.length
      //     ? false
      //     : true,
    },
  ];

  // Functions
  const getListActivityMember = async () => {
    setLoading(true);
    await getListActivities(ACTIVITY_CREATE_DCT, talentsPulseGetToken())
      .then((res) => {
        console.log(res);
        setDct({
          ...res.data.listActivities[0].dct,
          dctId: res.data.listActivities[0].dct._id,
        });
        setActivity(res.data.listActivities[0]);
      })
      .catch((error) => {
        console.log(
          "StepsDctScreen -> getListActivityMember Error: ",
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

  const handleOnNext = async () => {
    setCurrent(current + 1);
    setLoading(true);
    api.success({
      message: "Sauvegarde automatique",
      description: "Les informations saisies sont enregistrées en mémoire.",
      placement: "topRight",
    });
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleOnPrevious = () => {
    setCurrent(current - 1);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleOnChangeDct = (e) => {
    setDct({ ...dct, [e.target.name]: e.target.value });
  };

  const handleOnChangeStepTwo = (e) => {
    skills?.push(e);
    setDct({
      ...dct,
      skills,
    });
  };

  const handleOnChangeStepThree = (e) => {
    projects?.push(e);
    setDct({
      ...dct,
      projects,
    });
  };

  const handleOnChangeStepFourth = (e) => {
    projectsDetail?.push(e);
    setDct({
      ...dct,
      projectsDetail,
    });
  };

  const handleOnChangeStepFive = (e) => {
    formations?.push(e);
    setDct({
      ...dct,
      formations,
    });
  };

  const handleOnChangeStepSix = (e) => {
    tecnicalSkills?.push(e);
    setDct({
      ...dct,
      tecnicalSkills,
    });
  };

  const handleOnChangeStepSeven = (e) => {
    linguistics?.push(e);
    setDct({
      ...dct,
      linguistics,
    });
  };

  const onChange = (value) => {
    console.log("onChange:", current);
    setCurrent(value);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const contentTextModal = () => (
    <span style={{ fontSize: "16px" }}>
      Une fois cliqué sur le boutton{" "}
      <b className="dct-talents-pulse-primary">
        <i>OUI</i>
      </b>
      , toutes les données saissies des diffèrents steps seront effacées en
      mémoire et vous deviez récommencer à nouveau.
    </span>
  );

  const titleTextModal = () => (
    <span style={{ fontSize: "22px" }}>Voulez-vous supprimer les données?</span>
  );

  const handleOnClearAllData = () => {
    confirm({
      title: titleTextModal(),
      icon: <ExclamationCircleFilled />,
      centered: true,
      okText: "Oui",
      cancelText: "Non",
      content: contentTextModal(),
      onOk() {
        activityDelete(
          ACTIVITY_CREATE_DCT,
          activity.dct._id,
          activity.dct.user._id,
          talentsPulseGetToken()
        )
          .then((res) => {
            api.success({
              message: "Succés",
              description: res.data.message,
              placement: "topRight",
            });
            navigate(END_POINT_DASHBOARD);
          })
          .catch((error) => {
            console.log(
              "CreateDctScreen -> handelOnDeleteDct Error: ",
              error.response
            );
            api.error({
              message: "Erreur",
              description:
                error.response.data.message || error.response.data.error,
              placement: "topRight",
            });
          });
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const handleOnSaveMatricule = async (e) => {
    await dctUpdateMatricule(dctId, e, talentsPulseGetToken())
      .then((res) => {
        setDct(res.data.dct);
        api.success({
          message: "Succès",
          description: res.data.message,
          placement: "topRight",
        });
      })
      .catch((error) => {
        console.log(
          "StepsDctScreen -> handleOnUpdateMatricule Error: ",
          error.response
        );
        api.error({
          message: "Erreur",
          description: error.response.data.message || error.response.data.error,
          placement: "topRight",
        });
      });
  };

  // Render
  return (
    <Spin spinning={loading} size="large" tip="Loading">
      <DashboardLayout>
        <div className="talents-pulse-steps-wrapper container-fluid">
          {contextHolder}
          {mode === ACTION_EDIT && (
            <>
              <div className="dct-talents-pulse-space-between">
                <Button
                  onClick={() => navigate(END_POINT_DASHBOARD_DCTS)}
                  type="primary"
                  size="large"
                  className="float-left dct-talents-pulse-btn-outline-tomato"
                >
                  <ArrowLeftOutlined /> Allez sur les Dcts
                </Button>
              </div>
              <Divider className="dct-talents-pulse-background-sliver" />
            </>
          )}
          <div className="row">
            <div className="col-md-2 talents-pulse-steps-left">
              {mode !== ACTION_EDIT && (
                <>
                  <Button
                    block
                    type="primary"
                    size="large"
                    className="dct-talents-pulse-btn-tomato"
                    danger
                    onClick={handleOnClearAllData}
                  >
                    <ClearOutlined /> <b>Supprimez</b>
                  </Button>
                  <Divider className="dct-talents-pulse-background-white" />
                </>
              )}
              <Steps
                direction="vertical"
                onChange={onChange}
                current={current}
                items={steps}
              />
            </div>
            <div className="col-md-10 talents-pulse-steps-right">
              <div className="talents-pulse-steps-right-content">
                {steps[current]?.key === 0 && (
                  <TalentsPulseStepOne
                    steps={steps}
                    current={current}
                    handleOnPrevious={handleOnPrevious}
                    handleOnNext={handleOnNext}
                    dct={dct}
                    setDct={setDct}
                    handleOnChangeStepOne={handleOnChangeDct}
                    title={steps[current]?.title}
                  />
                )}
                {steps[current]?.key === 1 && (
                  <TalentsPulseStepTwo
                    steps={steps}
                    current={current}
                    handleOnPrevious={handleOnPrevious}
                    handleOnNext={handleOnNext}
                    dct={dct}
                    setDct={setDct}
                    handleOnChangeStepTwo={handleOnChangeStepTwo}
                    title={steps[current]?.title}
                  />
                )}
                {/* {steps[current]?.key === 2 && (
                  <TalentsPulseStepThree
                    steps={steps}
                    current={current}
                    handleOnPrevious={handleOnPrevious}
                    handleOnNext={handleOnNext}
                    dct={dct}
                    setDct={setDct}
                    handleOnChangeStepThree={handleOnChangeStepThree}
                    title={steps[current]?.title}
                  />
                )} */}
                {steps[current]?.key === 2 && (
                  <TalentsPulseStepFourth
                    steps={steps}
                    current={current}
                    handleOnPrevious={handleOnPrevious}
                    handleOnNext={handleOnNext}
                    handleOnChangeStepFourth={handleOnChangeStepFourth}
                    dct={dct}
                    setDct={setDct}
                    title={steps[current]?.title}
                    handleOnCancelStepDct={handleOnCancelStepDct}
                  />
                )}
                {steps[current]?.key === 3 && (
                  <TalentsPulseStepFive
                    steps={steps}
                    current={current}
                    handleOnPrevious={handleOnPrevious}
                    handleOnNext={handleOnNext}
                    handleOnChangeStepFive={handleOnChangeStepFive}
                    dct={dct}
                    setDct={setDct}
                    title={steps[current]?.title}
                  />
                )}
                {/* {steps[current]?.key === 5 && (
                  <TalentsPulseStepSix
                    steps={steps}
                    current={current}
                    handleOnPrevious={handleOnPrevious}
                    handleOnNext={handleOnNext}
                    handleOnChangeStepSix={handleOnChangeStepSix}
                    dct={dct}
                    setDct={setDct}
                    title={steps[current]?.title}
                  />
                )} */}
                {steps[current]?.key === 4 && (
                  <TalentsPulseStepSeven
                    steps={steps}
                    current={current}
                    handleOnPrevious={handleOnPrevious}
                    handleOnNext={handleOnNext}
                    handleOnChangeStepSeven={handleOnChangeStepSeven}
                    dct={dct}
                    setDct={setDct}
                    title={steps[current]?.title}
                  />
                )}
                {steps[current]?.key === 5 && (
                  <TalentsPulseStepSummary
                    steps={steps}
                    current={current}
                    handleOnPrevious={handleOnPrevious}
                    handleOnChangeStepSeven={handleOnChangeStepSeven}
                    handleOnSaveMatricule={handleOnSaveMatricule}
                    dct={dct}
                    setDct={setDct}
                    title={steps[current]?.title}
                    showSteps={true}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </Spin>
  );
};

export default StepsDctScreen;
