import React, { useEffect, useState } from "react";
import { Button, Divider, Input, Spin, Typography, notification } from "antd";
import AuthLeftScreen from "../inc/AuthLeftScreen";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  KeyOutlined,
  LoginOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { END_POINT_DASHBOARD, END_POINT_LOGIN } from "../../routers/end-points";
import {
  userFindByEmail,
  userForgotPassword,
} from "../../services/authService";
import { talentsPulseGetToken } from "../../utils";

const ForgotPasswordScreen = () => {
  // States
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [api, contextHolder] = notification.useNotification();
  const [forgotPassword, setForgotPassword] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  // Init
  useEffect(() => {
    let token = talentsPulseGetToken();
    if (token) navigate(END_POINT_DASHBOARD);
  }, []);

  // Destructing
  const { Title, Paragraph } = Typography;
  const { email, password, confirmPassword } = forgotPassword;

  // Functions
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

  const forgotPasswordForm = () => (
    <div className="dct-talents-pulse-form">
      <div className="container">
        <Title level={2} className="dct-talents-pulse-secondary text-left">
          Mot de passe oublié
        </Title>
        {!!user?.email?.length ? (
          <>
            <div className="row mb-3 mt-5">
              <div className="col">
                <label htmlFor="email" className="dct-talents-pulse-secondary">
                  Courrier électronique
                  <span className="dct-talents-pulse-field-required">*</span>
                </label>
                <Input
                  size="large"
                  prefix={<MailOutlined />}
                  type="email"
                  placeholder="Votre addresse email"
                  value={user?.email}
                  disabled
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-12 mb-3">
                <label htmlFor="password">
                  Mot de passe
                  <span className="dct-talents-pulse-field-required">*</span>
                </label>
                <Input.Password
                  size="large"
                  prefix={<KeyOutlined />}
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                  placeholder="Choisissez votre mot de passe"
                  value={password}
                  onChange={(e) =>
                    setForgotPassword({
                      ...forgotPassword,
                      password: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-12 mb-3">
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
                  placeholder="Confirmez votre mot de passe"
                  value={confirmPassword}
                  onChange={(e) =>
                    setForgotPassword({
                      ...forgotPassword,
                      confirmPassword: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="row mt-4">
              <div className="col">
                <Button
                  type="primary"
                  className="mb-3 dct-talents-pulse-btn-outline-secondary"
                  block
                  onClick={handleOnSubmit}
                  shape="round"
                  size="large"
                  disabled={
                    !!password?.length && !!confirmPassword?.length
                      ? false
                      : true
                  }
                >
                  <LoginOutlined /> Entrez
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="row mb-4 mt-5">
              <div className="col">
                <label htmlFor="email" className="dct-talents-pulse-secondary">
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
                    setForgotPassword({
                      ...forgotPassword,
                      email: e.target.value,
                    })
                  }
                />
                <Paragraph className="mt-2">
                  Utilisez l'adresse associée à votre compte
                </Paragraph>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col">
                <Button
                  type="primary"
                  className="mb-3 dct-talents-pulse-btn-outline-secondary"
                  block
                  onClick={handleOnFindUser}
                  shape="round"
                  size="large"
                  disabled={!!email?.length ? false : true}
                >
                  <LoginOutlined /> Entrez
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    if (handleOnVerifyPassword()) {
      await userForgotPassword({ email, password })
        .then((res) => {
          console.log("userForgotPassword: ", res);
          if (res.status === 200) {
            api.success({
              message: `Bingo ${res.data?.user?.firstName} ${res.data?.user?.lastName}.`,
              description: `${res.data?.message}`,
              placement: "topRight",
            });
            setTimeout(() => {
              navigate(END_POINT_LOGIN);
            }, 2000);
          }
        })
        .catch((error) => {
          console.log("Login -> userForgotPassword error: ", error);
          api.error({
            message: "Erreur",
            description:
              error.response.data.message || error.response.data.error,
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

  const handleOnFindUser = async (e) => {
    e.preventDefault();

    await userFindByEmail({ email })
      .then((res) => {
        console.log("userFindByEmail: ", res);
        if (res.status === 200) {
          setUser(res.data?.user);
        }
      })
      .catch((error) => {
        console.log("Login -> userFindByEmail error: ", error);
        api.error({
          message: "Erreur",
          description: error.response.data.message || error.response.data.error,
          placement: "topRight",
        });
      });
  };

  const handleOnLogin = () => {
    setLoading(true);
    setTimeout(() => {
      navigate(END_POINT_LOGIN);
    }, 1000);
  };

  const handleOnVerifyPassword = () => {
    return password === confirmPassword ? true : false;
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
            {forgotPasswordForm()}
            <div className="dct-talents-pulse-home-cta">
              <Divider className="auth-right-divider dct-talents-pulse-border-top-secondary">
                Vous vous souveniez de votre mot de passe ?
              </Divider>
              {loginForm()}
            </div>
          </div>
        </div>
      </div>
    </Spin>
  );
};

export default ForgotPasswordScreen;
