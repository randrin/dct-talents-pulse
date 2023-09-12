import React, { useEffect, useState } from "react";
import {
  Input,
  Typography,
  Button,
  Radio,
  Divider,
  DatePicker,
  Select,
  Avatar,
  Tooltip,
  notification,
  Checkbox,
  Spin,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  UserAddOutlined,
  LoginOutlined,
  InfoCircleOutlined,
  KeyOutlined,
  EyeTwoTone,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import { END_POINT_DASHBOARD, END_POINT_LOGIN } from "../../routers/end-points";
import { Link, useNavigate } from "react-router-dom";
import { getListCountriesFlags } from "../../services/utilService";
import { candidateRegistration } from "../../services/authService";
import AuthLeftScreen from "../inc/AuthLeftScreen";
import { GENDER_FEMALE, GENDER_MALE } from "../../utils/constants";
import { userByToken } from "../../services/userService";
import moment from "moment";
import { talentsPulseGetToken } from "../../utils";

const RegisterScreen = () => {
  // States
  const [api, contextHolder] = notification.useNotification();
  const [candidate, setCandidate] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: GENDER_MALE,
    country: "France",
    dateOfBorn: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [accetpTerms, setAccetpTerms] = useState(false);
  const [countries, setCountries] = useState([]);
  const navigate = useNavigate();

  // Destructing
  const { Option } = Select;
  const { Title } = Typography;
  const {
    firstName,
    lastName,
    email,
    gender,
    country,
    dateOfBorn,
    password,
    confirmPassword,
  } = candidate;

  // Init
  useEffect(() => {
    let token = talentsPulseGetToken();
    if (token && token !== undefined) handleOnGetUserLogged(token);
    listCountriesFlags();
  }, []);

  const informationBornDate = (
    <span className="text-justify">
      The date of birth is a necessary element to authenticate and restore your
      account, as well as to ensure that you are only allowed access to
      age-appropriate content. Your privacy and trust are core values for
      talents-pulse. For more information,{" "}
      <Link to="#" className="dct-talents-pulse-text-underline">
        visit the Privacy Center.
      </Link>
    </span>
  );

  // Functions
  const handleOnGetUserLogged = async (token) => {
    console.log("token: ", token);
    setLoading(true);
    await userByToken(token)
      .then((res) => {
        console.log("User logged: ", res);
        if (res.status === 200 && res.data?.user) {
          navigate(END_POINT_DASHBOARD);
        }
      })
      .catch((error) => {
        console.log("Login -> userAuthenticated error: ", error);
        api.error({
          message: "Erreur",
          description: error.response.data.message || error.response.data.error,
          placement: "topRight",
        });
      });
    setLoading(false);
  };

  const listCountriesFlags = async () => {
    getListCountriesFlags()
      .then((res) => {
        if (res.status === 200) {
          setCountries(res?.data?.data);
        }
      })
      .catch((error) => {
        console.log("Register -> listCountriesFlags Error: ", error);
      });
  };

  const loginForm = () => (
    <div className="container">
      <div className="row mt-4 auth-right-form-btn">
        <div className="col">
          <Button
            type="primary"
            htmlType="submit"
            className="mb-3 dct-talents-pulse-btn-secondary"
            block
            onClick={handleOnLogin}
            shape="round"
            size="large"
          >
            <LoginOutlined /> Connectez-vous
          </Button>
        </div>
      </div>
    </div>
  );

  const handleOnValidate = () => {
    return !!gender?.length &&
      !!email?.length &&
      !!firstName?.length &&
      !!lastName?.length &&
      !!country?.length &&
      !!password?.length &&
      !!dateOfBorn?.length &&
      accetpTerms
      ? false
      : true;
  };

  const handleSelectSearch = (val) => {
    console.log("search:", val);
  };

  const handleOnAccetpTerms = (e) => {
    setAccetpTerms(e.target.checked);
  };

  const registerForm = () => (
    <form onSubmit={handleOnSubmit} className="dct-talents-pulse-form">
      <div className="container">
        <Title level={2} className="dct-talents-pulse-secondary text-left">
          Créer votre compte
        </Title>
        <div className="row mt-5">
          <div className="col-md-6 mb-3">
            <label htmlFor="gender">
              Civilité <span className="dct-talents-pulse-field-required">*</span>
            </label>
            <Radio.Group
              name="gender"
              defaultValue={GENDER_MALE}
              onChange={(e) =>
                setCandidate({ ...candidate, gender: e.target.value })
              }
            >
              <Radio value={GENDER_MALE}>Monsieur</Radio>
              <Radio value={GENDER_FEMALE}>Madame</Radio>
            </Radio.Group>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="firstName">
              Prénom <span className="dct-talents-pulse-field-required">*</span>
            </label>
            <Input
              size="large"
              prefix={<UserOutlined />}
              type="text"
              placeholder="Votre prénom"
              value={firstName}
              onChange={(e) =>
                setCandidate({ ...candidate, firstName: e.target.value })
              }
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="lastName">
              Nom <span className="dct-talents-pulse-field-required">*</span>
            </label>
            <Input
              size="large"
              prefix={<UserOutlined />}
              type="text"
              placeholder="Votre nom"
              value={lastName}
              onChange={(e) =>
                setCandidate({ ...candidate, lastName: e.target.value })
              }
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col">
            <label htmlFor="email">
              Courrier électronique
              <span className="dct-talents-pulse-field-required">*</span>
            </label>
            <Input
              size="large"
              prefix={<MailOutlined />}
              type="email"
              placeholder="Votre addresse email"
              value={email}
              onChange={(e) =>
                setCandidate({ ...candidate, email: e.target.value })
              }
            />
          </div>
        </div>
        <div className="row mb-1">
          <div className="col-md-6 mb-3">
            <label htmlFor="password">
              Mot de passe <span className="dct-talents-pulse-field-required">*</span>
            </label>
            <Input.Password
              size="large"
              prefix={<KeyOutlined />}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              placeholder="Votre mot de passe"
              value={password}
              onChange={(e) =>
                setCandidate({ ...candidate, password: e.target.value })
              }
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="confirmPassword">
              Confirmation mot de passe
              <span className="dct-talents-pulse-field-required">*</span>
            </label>
            <Input.Password
              size="large"
              prefix={<KeyOutlined />}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              placeholder="Confirmez mot de passe"
              value={confirmPassword}
              onChange={(e) =>
                setCandidate({ ...candidate, confirmPassword: e.target.value })
              }
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-7 mb-3">
            <label htmlFor="dateOfBorn">
              Naissance (18 ans au plus)
              <span className="dct-talents-pulse-field-required">*</span>
            </label>
            <Tooltip
              placement="topLeft"
              title={informationBornDate}
              className="dct-talents-pulse-cursor-pointer"
            >
              <InfoCircleOutlined className="float-right dct-talents-pulse-secondary" />
            </Tooltip>
            <DatePicker
              name="dateOfBorn"
              style={{ width: "100%" }}
              placeholder="Selectionez une date"
              size="large"
              onChange={(date, dateString) =>
                setCandidate({ ...candidate, dateOfBorn: dateString })
              }
              disabledDate={(current) =>
                current && current.valueOf() > moment().subtract(18, "year")
              }
            />
          </div>
          <div className="col-md-5 mb-3">
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
        </div>
        <div className="row mb-4">
          <div className="col">
            <Checkbox value={accetpTerms} onChange={handleOnAccetpTerms}>
              J'accepte les{" "}
              <Link
                to="#"
                className="dct-talents-pulse-primary dct-talents-pulse-text-underline"
              >
                Conditions générales
              </Link>{" "}
              et{" "}
              <Link
                to="#"
                className="dct-talents-pulse-primary dct-talents-pulse-text-underline"
              >
                Politiques d'utilisations
              </Link>{" "}
              d'talents-pulse
            </Checkbox>
          </div>
        </div>
        {/* <div className="row mb-3">
          <div className="col">
            <Paragraph className="text-justify">
              En créant un compte, vous acceptez les{" "}
              <Link to="#" className="dct-talents-pulse-text-underline">
                Conditions générales de vente
              </Link>{" "}
              d’xxxxx. Veuillez consulter notre{" "}
              <Link to="#" className="dct-talents-pulse-text-underline">
                Notice Protection de vos Informations Personnelles,
              </Link>{" "}
              notre{" "}
              <Link to="#" className="dct-talents-pulse-text-underline">
                Notice Cookies
              </Link>{" "}
              et notre{" "}
              <Link to="#" className="dct-talents-pulse-text-underline">
                Notice Annonces publicitaires basées sur vos centres d’intérêt.
              </Link>
            </Paragraph>
            <Paragraph className="text-justify">
              En cliquant sur Crea account, je confirme avoir lu et accepté les{" "}
              <Link to="#" className="dct-talents-pulse-text-underline">
                Conditions d'utilisations
              </Link>{" "}
              et la{" "}
              <Link to="#" className="dct-talents-pulse-text-underline">
                Politique de confidentialité.
              </Link>
            </Paragraph>
          </div>
        </div> */}
        <div className="row mt-4">
          <div className="col">
            <Button
              type="primary"
              htmlType="submit"
              className="mb-3 dct-talents-pulse-btn-outline-secondary"
              block
              shape="round"
              size="large"
              disabled={handleOnValidate()}
            >
              <UserAddOutlined /> Créz votre compte
            </Button>
          </div>
        </div>
      </div>
    </form>
  );

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    if (handleOnVerifyPassword()) {
      await candidateRegistration(candidate)
        .then((res) => {
          console.log("candidateRegistration: ", res);
          if (res.status === 201) {
            api.success({
              message: res.data.message,
              description: `Bingo ${res.data.user.firstName} ${res.data.user.lastName}!!! Vous faites desormais partir de la gestion talents-pulse. Connectez-vous à présent.`,
              placement: "topRight",
            });
            setTimeout(() => {
              handleOnLogin();
            }, 2000);
          }
        })
        .catch((error) => {
          console.log("Register -> userRegistration error: ", error);
          api.error({
            message: "Erreur",
            description:
              error.response.data.error || error.response.data.message,
            placement: "topRight",
          });
        });
    } else {
      api.error({
        message: "Erreur",
        description:
          "Mot de passe et Confimation Mot de passe ne sont pas identiques. Essaies de nouveau.",
        placement: "topRight",
      });
    }
    setLoading(false);
  };

  const handleOnVerifyPassword = () => {
    return password === confirmPassword ? true : false;
  };

  const handleOnLogin = () => {
    setLoading(true);
    setTimeout(() => {
      navigate(END_POINT_LOGIN);
    }, 1000);
  };

  // Render
  return (
    <Spin spinning={loading} size="large" tip="Loading">
      <div className="dct-talents-pulse-wrapper container-fluid">
        {contextHolder}
        <div className="row">
          <div className="col-md-6 dct-talents-pulse-home-left">
            <AuthLeftScreen />
          </div>
          <div className="col-md-6 dct-talents-pulse-home-right auth-right-form">
            {registerForm()}
            <div className="dct-talents-pulse-home-cta">
              <Divider className="auth-right-divider dct-talents-pulse-border-top-secondary">
                Vous avez déjà un compte?
              </Divider>
              {loginForm()}
            </div>
          </div>
        </div>
      </div>
    </Spin>
  );
};

export default RegisterScreen;
