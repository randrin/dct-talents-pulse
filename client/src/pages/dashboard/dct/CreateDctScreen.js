import React, { useEffect, useState } from "react";
import {
  Alert,
  Avatar,
  Button,
  DatePicker,
  Divider,
  Input,
  InputNumber,
  Radio,
  Select,
  Space,
  Spin,
  Typography,
  notification,
} from "antd";
import {
  CheckOutlined,
  DeleteOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { END_POINT_DASHBOARD_STEPS_DCT } from "../../../routers/end-points";
import {
  ACTION_ACTIVE,
  ACTIVITY_CREATE_DCT,
  DATE_PICKER_FORMAT,
  FORMAT_DATETIME,
  GENDER_FEMALE,
  GENDER_MALE,
} from "../../../utils/constants";
import { getListCountriesFlags } from "../../../services/utilService";
import DashboardLayout from "../DashboardLayout";
import { getListSectors } from "../../../services/sectorService";
import { getListExpertisesBySector } from "../../../services/expertiseService";
import { userFindByEmail } from "../../../services/authService";
import { talentsPulseGetToken } from "../../../utils";
import {
  activityCreate,
  activityDelete,
  getListActivities,
} from "../../../services/activityService";
import moment from "moment";
import dayjs from "dayjs";

const CreateDctScreen = () => {
  // States
  const [api, contextHolder] = notification.useNotification();
  const [sectors, setSectors] = useState([]);
  const [expertises, setExpertises] = useState([]);
  const navigate = useNavigate();
  const [countries, setCountries] = useState([]);
  const [candidate, setCandidate] = useState({
    gender: GENDER_MALE,
    firstName: "",
    lastName: "",
    email: "",
    country: "France",
    dateOfBorn: "",
    nationality: "France",
    matricule: "",
    profession: "",
    sector: "",
    expNumber: 0,
  });
  const [activity, setActivity] = useState({
    activityType: "",
    user: "",
    dct: "",
    createdAt: "",
  });
  const [dctContinue, setDctContinue] = useState(false);
  const [loading, setLoading] = useState(false);

  // Destructing
  const { Option } = Select;
  const { Title } = Typography;
  const {
    gender,
    firstName,
    lastName,
    email,
    country,
    dateOfBorn,
    nationality,
    profession,
    sector,
    expNumber,
  } = candidate;

  // Init
  const defaultDateOfBorn = moment(new Date())
    .subtract(18, "year")
    .format(DATE_PICKER_FORMAT);

  useEffect(() => {
    getListActivityMember();
    listCountriesFlags();
    listSectors();
  }, []);

  useEffect(() => {
    if (sector) {
      listExpertisesBySector();
    }
  }, [sector]);

  useEffect(() => {
    setCandidate({ ...candidate, dateOfBorn: defaultDateOfBorn });
  }, [defaultDateOfBorn]);

  // Functions
  const getListActivityMember = async () => {
    setLoading(true);
    await getListActivities(ACTIVITY_CREATE_DCT, talentsPulseGetToken())
      .then((res) => {
        console.log(res);
        setActivity(res.data.listActivities[0]);
        setDctContinue(true);
      })
      .catch((error) => {
        console.log(
          "CreateDctScreen -> getListActivityMember Error: ",
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

  const listExpertisesBySector = () => {
    getListExpertisesBySector(sector)
      .then((res) => {
        setExpertises(
          res.data.listExpertises?.filter(
            (sector) => sector.status === ACTION_ACTIVE
          )
        );
      })
      .catch((error) => {
        console.log(
          "CreateDctScreen -> listExpertisesBySector Error: ",
          error.response
        );
        api.error({
          message: "Erreur",
          description: error.response.data.message || error.response.data.error,
          placement: "topRight",
        });
      });
  };

  const listCountriesFlags = async () => {
    getListCountriesFlags()
      .then((res) => {
        if (res.status === 200) {
          setCountries(res?.data?.data);
        }
      })
      .catch((error) => {
        console.log("CreateDctScreen -> listCountriesFlags Error: ", error);
        api.error({
          message: "Erreur",
          description: error.response.data.message || error.response.data.error,
          placement: "topRight",
        });
      });
  };

  const listSectors = () => {
    getListSectors()
      .then((res) => {
        setSectors(
          res.data.listSectors?.filter(
            (sector) => sector.status === ACTION_ACTIVE
          )
        );
      })
      .catch((error) => {
        console.log("CreateDctScreen -> listSectors Error: ", error.response);
        api.error({
          message: "Erreur",
          description: error.response.data.message || error.response.data.error,
          placement: "topRight",
        });
      });
  };

  const handleSelectSearch = (val) => {
    console.log("search:", val);
  };

  const handleOnNavigate = async () => {
    await activityCreate(candidate, talentsPulseGetToken())
      .then((res) => {
        if (res.status === 201) {
          navigate(END_POINT_DASHBOARD_STEPS_DCT);
        }
      })
      .catch((error) => {
        console.log("CreateDctScreen -> handleOnNavigate error: ", error);
        api.error({
          message: "Erreur",
          description: error.response.data.message || error.response.data.error,
          placement: "topRight",
        });
      });
  };

  const handleOnContinue = async (e) => {
    e.preventDefault();

    await userFindByEmail({ email })
      .then((res) => {
        console.log("userFindByEmail: ", res);
        if (activity) {
          if (res.status === 200 && email !== activity.dct.user.email) {
            api.error({
              message: "Erreur",
              description: `Candidate with ${email} email already exist in the system.`,
              placement: "topRight",
            });
          } else {
            navigate(END_POINT_DASHBOARD_STEPS_DCT);
          }
        } else {
          if (res.status === 200) {
            api.error({
              message: "Erreur",
              description: `Candidate with ${email} email already exist in the system.`,
              placement: "topRight",
            });
          }
        }
      })
      .catch((error) => {
        console.log("CreateDctScreen -> userFindByEmail error: ", error);
        if (error.code === "ERR_BAD_REQUEST") {
          handleOnNavigate();
        } else {
          api.error({
            message: "Erreur",
            description:
              error.response.data.message || error.response.data.error,
            placement: "topRight",
          });
        }
      });
  };

  const handleOnDisabled = () => {
    return !!gender?.length &&
      !!lastName?.length &&
      !!firstName?.length &&
      !!email?.length &&
      !!profession?.length &&
      !!country?.length &&
      !!nationality?.length &&
      !!sector?.length &&
      !!dateOfBorn?.length
      ? false
      : true;
  };

  const alertDescription = () => (
    <>
      <p className="dct-talents-pulse-title">
        Vous avez en cours une activité de création du Dossier de compétences
        technique du candidat{" "}
        <b>
          {activity.dct.user?.firstName} {activity.dct.user?.lastName}
        </b>{" "}
        créé en date du{" "}
        <i>{moment(activity?.createdAt).format(FORMAT_DATETIME)}</i>.
      </p>
      <p className="dct-talents-pulse-title">
        Voulez-vous la compléter? Dans le cas contaire, le dossier séra effacé
        et vous sériez rédirigé sur une interface pour une nouvelle création de
        dossier.
      </p>
    </>
  );

  const handelOnContinueDct = () => {
    setDctContinue(false);
    setLoading(true);

    setTimeout(() => {
      setCandidate({
        firstName: activity.dct.user.firstName,
        lastName: activity.dct.user.lastName,
        country: activity.dct.user.country,
        dateOfBorn: activity.dct.user.dateOfBorn,
        email: activity.dct.user.email,
        gender: activity.dct.user.gender,
        expNumber: activity.dct.expNumber,
        profession: activity.dct.expertise._id,
        sector: activity.dct.sector,
        nationality: activity.dct.nationality,
      });
      setLoading(false);
    }, 1000);
  };

  const handelOnDeleteDct = async () => {
    setLoading(true);
    setDctContinue(false);
    await activityDelete(
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
        setDctContinue(false);
      })
      .catch((error) => {
        console.log(
          "CreateDctScreen -> handelOnDeleteDct Error: ",
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
      <DashboardLayout className="dct-talents-pulse-wrapper container-fluid">
        {contextHolder}
        <div className="row dct-talents-pulse-space-center">
          {activity && dctContinue ? (
            <div className="dct-talents-pulse-form col-md-8 dct-talents-pulse-home-right">
              <Alert
                message={
                  <h4>
                    <b>Dct en cours</b>
                  </h4>
                }
                description={alertDescription()}
                type="info"
                showIcon={true}
                action={
                  <Space direction="vertical">
                    <Button
                      size="large"
                      type="primary"
                      className="dct-talents-pulse-btn-secondary"
                      onClick={handelOnContinueDct}
                    >
                      <CheckOutlined /> Je continue
                    </Button>
                    <Button
                      size="large"
                      danger
                      type="ghost"
                      className="dct-talents-pulse-btn-tomato"
                      onClick={handelOnDeleteDct}
                    >
                      <DeleteOutlined /> Je supprime
                    </Button>
                  </Space>
                }
              />
            </div>
          ) : (
            <div className="dct-talents-pulse-form col-md-8 dct-talents-pulse-home-right">
              <Title
                level={2}
                className="dct-talents-pulse-secondary text-left"
              >
                Informations Personnelles
              </Title>
              <Divider className="dct-talents-pulse-background-sliver dct-talents-pulse-without-margin" />
              <div className="row mt-4 mb-2">
                <div className="col-md-6 mb-3">
                  <label htmlFor="gender">
                    Civilité
                    <span className="dct-talents-pulse-field-required">*</span>
                  </label>
                  <br />
                  <Radio.Group
                    name="gender"
                    value={gender}
                    onChange={(e) =>
                      setCandidate({ ...candidate, gender: e.target.value })
                    }
                  >
                    <Radio value={GENDER_MALE}>Monsieur</Radio>
                    <Radio value={GENDER_FEMALE}>Madame</Radio>
                  </Radio.Group>
                </div>
              </div>
              <div className="row mb-4">
                <div className="col-md-6">
                  <label htmlFor="lastName">
                    Prénom{" "}
                    <span className="dct-talents-pulse-field-required">*</span>
                  </label>
                  <Input
                    size="large"
                    type="text"
                    name="lastName"
                    onChange={(e) =>
                      setCandidate({
                        ...candidate,
                        lastName: e.target.value,
                      })
                    }
                    placeholder="Insérez un prénom"
                    value={lastName}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="firstName">
                    Nom{" "}
                    <span className="dct-talents-pulse-field-required">*</span>
                  </label>
                  <Input
                    size="large"
                    name="firstName"
                    type="text"
                    placeholder="Insérez un nom"
                    value={firstName}
                    onChange={(e) =>
                      setCandidate({
                        ...candidate,
                        firstName: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="row mb-4">
                <div className="col-md-5">
                  <label htmlFor="email">
                    Email{" "}
                    <span className="dct-talents-pulse-field-required">*</span>
                  </label>
                  <Input
                    size="large"
                    name="email"
                    type="email"
                    placeholder="Courrier électronique"
                    value={email}
                    onChange={(e) =>
                      setCandidate({
                        ...candidate,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-md-4">
                  <label htmlFor="dateOfBorn">
                    Naissance (18 ans au plus)
                    <span className="dct-talents-pulse-field-required">*</span>
                  </label>
                  <DatePicker
                    defaultValue={dayjs(
                      dateOfBorn || defaultDateOfBorn,
                      DATE_PICKER_FORMAT.replaceAll("/", "-")
                    )}
                    name="dateOfBorn"
                    style={{ width: "100%" }}
                    placeholder="Selectionez une date"
                    size="large"
                    onChange={(date, dateString) =>
                      setCandidate({ ...candidate, dateOfBorn: dateString })
                    }
                    disabledDate={(current) =>
                      current &&
                      current.valueOf() > moment().subtract(18, "year")
                    }
                  />
                </div>
                <div className="col-md-3">
                  <label htmlFor="country">
                    Pays de résidence
                    <span className="dct-talents-pulse-field-required">*</span>
                  </label>
                  <Select
                    name="country"
                    size="large"
                    value={country}
                    showSearch
                    showArrow
                    style={{ width: "100%" }}
                    placeholder="Selectionez un pays"
                    optionFilterProp="children"
                    onChange={(e) => setCandidate({ ...candidate, country: e })}
                    onSearch={handleSelectSearch}
                    filterOption={(input, option) =>
                      option.value.toLowerCase().indexOf(input.toLowerCase()) >=
                      0
                    }
                  >
                    {countries.map((ctry, index) => (
                      <Option key={index} value={ctry.name}>
                        <Avatar src={ctry.flag} size={20} /> {ctry.name}
                      </Option>
                    ))}
                  </Select>
                </div>
              </div>
              <Title
                level={2}
                className="dct-talents-pulse-secondary text-left"
              >
                Informations Professionnelles
              </Title>
              <Divider className="dct-talents-pulse-background-sliver dct-talents-pulse-without-margin" />
              <div className="row mb-4 mt-4">
                <div className="col-md-6">
                  <label htmlFor="sector">
                    Pôle de compétences
                    <span className="dct-talents-pulse-field-required">*</span>
                  </label>
                  <Select
                    name="sector"
                    size="large"
                    showSearch
                    style={{ width: "100%" }}
                    placeholder="Selectionez un pôle"
                    optionFilterProp="children"
                    value={sector}
                    onChange={(e) =>
                      setCandidate({ ...candidate, sector: e, profession: "" })
                    }
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {sectors.map((sector, index) => (
                      <Option key={index} value={sector._id}>
                        {sector.name}
                      </Option>
                    ))}
                  </Select>
                </div>
                <div className="col-md-6">
                  <label htmlFor="profession">
                    Votre Métier
                    <span className="dct-talents-pulse-field-required">*</span>
                  </label>
                  <Select
                    name="profession"
                    size="large"
                    showSearch
                    style={{ width: "100%" }}
                    placeholder="Selectionez un métier"
                    optionFilterProp="children"
                    value={profession}
                    disabled={!expertises.length}
                    onChange={(e) =>
                      setCandidate({ ...candidate, profession: e })
                    }
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {expertises.map((expertise, index) => (
                      <Option key={index} value={expertise._id}>
                        {expertise.name}
                      </Option>
                    ))}
                  </Select>
                </div>
              </div>
              <div className="row mb-4">
                <div className="col-md-6 mb-3">
                  <label htmlFor="nationality">
                    Nationalité
                    <span className="dct-talents-pulse-field-required">*</span>
                  </label>
                  <Select
                    name="nationality"
                    size="large"
                    placeholder="Sélectionez un pays"
                    value={nationality}
                    showSearch
                    showArrow
                    style={{ width: "100%" }}
                    optionFilterProp="children"
                    onChange={(e) =>
                      setCandidate({ ...candidate, nationality: e })
                    }
                    onSearch={handleSelectSearch}
                    filterOption={(input, option) =>
                      option.value.toLowerCase().indexOf(input.toLowerCase()) >=
                      0
                    }
                  >
                    {countries.map((ctry, index) => (
                      <Option key={index} value={ctry.name}>
                        <Avatar src={ctry.flag} size={20} /> {ctry.name}
                      </Option>
                    ))}
                  </Select>
                </div>
                <div className="col-md-6 mb-3" style={{ display: "grid" }}>
                  <label htmlFor="expNumber">
                    Nombre d'année d'expérience
                    <span className="dct-talents-pulse-field-required">*</span>
                  </label>
                  <InputNumber
                    style={{ width: "100px" }}
                    size="large"
                    value={expNumber}
                    min={0}
                    max={100000}
                    defaultValue={1}
                    onChange={(e) =>
                      setCandidate({
                        ...candidate,
                        expNumber: e,
                      })
                    }
                  />
                </div>
              </div>
              <Button
                type="primary"
                size="large"
                shape="round"
                className="float-right mt-4 dct-talents-pulse-btn-outline-secondary"
                disabled={handleOnDisabled()}
                onClick={handleOnContinue}
              >
                <span className="talents-pulse-standard-title">Continuez</span>{" "}
                <RightOutlined />
              </Button>
            </div>
          )}
        </div>
      </DashboardLayout>
    </Spin>
  );
};

export default CreateDctScreen;
