import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Input,
  InputNumber,
  Select,
  Typography,
  notification,
} from "antd";
import { useNavigate } from "react-router-dom";
import AuthLeftScreen from "../../inc/AuthLeftScreen";
import { getListExpertisesBySector } from "../../../services/expertiseService";
import {
  findSectorById,
  getListSectors,
} from "../../../services/sectorService";
import { ACTION_ACTIVE } from "../../../utils/constants";
import { ArrowLeftOutlined, CheckCircleOutlined } from "@ant-design/icons";
import {
  talentsPulseGetToken,
  talentsPulseGetUser,
  talentsPulseRemoveToken,
  talentsPulseSetUser,
} from "../../../utils";
import {
  END_POINT_DASHBOARD,
  END_POINT_LOGIN,
} from "../../../routers/end-points";
import { dctCreate } from "../../../services/dctService";
import { getListCountriesFlags } from "../../../services/utilService";

const ProfileCompletedScreen = () => {
  // States
  const [api, contextHolder] = notification.useNotification();
  const [dct, setDct] = useState({
    sector: "",
    expertiseUser: "",
    expertise: "",
    expNumber: 0,
    nationality: "France",
  });
  const [sectorSelected, setSectorSelected] = useState({});
  const [expertises, setExpertises] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [countries, setCountries] = useState([]);
  const navigate = useNavigate();

  // Destructing
  const { Title } = Typography;
  const { Option } = Select;
  const { sector, expertise, expertiseUser, expNumber, nationality } = dct;

  // Init
  useEffect(() => {
    if (talentsPulseGetToken() && !talentsPulseGetUser()?.emailVerified) {
      listSectors();
      listCountriesFlags();
    } else {
      navigate(END_POINT_DASHBOARD);
    }
  }, []);

  useEffect(() => {
    if (sector) {
      listExpertisesBySector();
      handleOnGetSectorById();
    }
  }, [sector]);

  // Functions
  const handleOnGetSectorById = async () => {
    setDct({ ...dct, expertiseUser: "" });
    await findSectorById(sector)
      .then((res) => {
        setSectorSelected(res.data.sector);
      })
      .catch((error) => {
        console.log(
          "ProfileCompletedScreen -> handleOnGetSectorById Error: ",
          error.response
        );
        api.error({
          message: "Erreur",
          description: error.response.data.message || error.response.data.error,
          placement: "topRight",
        });
      });
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
          "ProfileCompletedScreen -> listExpertises Error: ",
          error.response
        );
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
        console.log(
          "ProfileCompletedScreen -> listSectors Error: ",
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
        console.log(
          "ProfileCompletedScreen -> listCountriesFlags Error: ",
          error
        );
      });
  };

  const handleOnConvertText = () => {
    // Convert the sector user in capitalize letter
    setDct({
      ...dct,
      expertiseUser: expertiseUser
        .split(" ")
        .map(
          (element) => element.charAt(0).toLocaleUpperCase() + element.slice(1)
        )
        .join(" "),
    });
  };

  const profileForm = () => (
    <div className="dct-talents-pulse-form">
      <div className="container">
        <Title level={2} className="dct-talents-pulse-secondary text-left">
          Complètez votre profil
        </Title>
        <div className="row mt-5">
          <div className="col mb-4">
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
              onChange={(e) => setDct({ ...dct, sector: e, expertise: "" })}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {sectors.map((sector, index) => (
                <Option key={index} value={sector._id}>
                  {sector.name}
                </Option>
              ))}
            </Select>
          </div>
        </div>
        <div className="row">
          <div className="col mb-4">
            <label htmlFor="expertise">
              Votre Métier{" "}
              <span className="dct-talents-pulse-field-required">*</span>
            </label>
            {sectorSelected.code === "AU" ? (
              <Input
                size="large"
                name="expertiseUser"
                type="text"
                placeholder="Précisez votre métier"
                value={expertiseUser}
                onChange={(e) =>
                  setDct({
                    ...dct,
                    expertiseUser: e.target.value,
                  })
                }
                onKeyDown={handleOnConvertText}
              />
            ) : (
              <Select
                name="sector"
                size="large"
                showSearch
                style={{ width: "100%" }}
                placeholder="Selectionez un métier"
                optionFilterProp="children"
                value={expertise}
                disabled={!expertises.length}
                onChange={(e) => setDct({ ...dct, expertise: e })}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {expertises.map((expertise, index) => (
                  <Option key={index} value={expertise._id}>
                    {expertise.name}
                  </Option>
                ))}
              </Select>
            )}
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="nationality">
              Nationalité
              <span className="dct-talents-pulse-field-required">*</span>
            </label>
            <Select
              name="nationality"
              size="large"
              placeholder="Sélectionez la nationalité"
              value={nationality}
              showSearch
              showArrow
              style={{ width: "100%" }}
              optionFilterProp="children"
              onChange={(e) => setDct({ ...dct, nationality: e })}
              filterOption={(input, option) =>
                option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
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
              Année d'expérience
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
                setDct({
                  ...dct,
                  expNumber: e,
                })
              }
            />
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-md-6">
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
          <div className="col-md-6">
            <Button
              type="primary"
              className="mb-3 dct-talents-pulse-btn-outline-secondary"
              block
              onClick={handleOnUpdateProfile}
              shape="round"
              size="large"
              disabled={
                !!sector?.length &&
                (!!expertise?.length || !!expertiseUser?.length)
                  ? false
                  : true
              }
            >
              <CheckCircleOutlined /> Mettre à jour
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const handleOnBack = () => {
    talentsPulseRemoveToken();
    navigate(END_POINT_LOGIN);
  };

  const handleOnUpdateProfile = async (e) => {
    e.preventDefault();

    await dctCreate(dct, talentsPulseGetToken())
      .then((res) => {
        api.success({
          message: `Bingoo ${res.data?.user?.firstName} ${res.data?.user?.lastName}.`,
          description: res.data.message,
          placement: "topRight",
        });
        // Set in localStorage
        talentsPulseSetUser(res.data);
        setTimeout(() => {
          navigate(END_POINT_DASHBOARD);
        }, 1500);
      })
      .catch((error) => {
        console.log(
          "ProfileCompletedScreen -> dctCreate Error: ",
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
    <div className="dct-talents-pulse-wrapper container-fluid">
      {contextHolder}
      <div className="row">
        <div className="col-md-6 dct-talents-pulse-home-left">
          <AuthLeftScreen />
        </div>
        <div className="col-md-6 dct-talents-pulse-home-right auth-right-form">
          {profileForm()}
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletedScreen;
