import React, { useEffect, useState } from "react";
import AuthLeftScreen from "../inc/AuthLeftScreen";
import { Button, Divider, Input, Spin, Typography, notification } from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  KeyOutlined,
  LoginOutlined,
  MailOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import {
  END_POINT_DASHBOARD,
  END_POINT_FORGOT_PASSWORD,
  END_POINT_LOGIN,
  END_POINT_PROFILE_COMPLETED,
  END_POINT_REGISTER,
} from "../../routers/end-points";
import { userAuthenticated } from "../../services/authService";
import { userByToken } from "../../services/userService";
import { talentsPulseGetToken, talentsPulseSetUser } from "../../utils";

const LoginScreen = () => {
  // States
  const [api, contextHolder] = notification.useNotification();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Destructing
  const { Title } = Typography;
  const { email, password } = user;

  // Init
  useEffect(() => {
    let token = talentsPulseGetToken();
    if (token && token !== undefined) handleOnGetUserLogged(token);
  }, []);

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
        navigate(END_POINT_LOGIN);
      });
    setLoading(false);
  };

  const registerForm = () => (
    <div className="container">
      <div className="row mt-4 auth-right-form-btn">
        <div className="col">
          <Button
            type="primary"
            htmlType="submit"
            className="mb-3 dct-talents-pulse-btn-secondary"
            block
            onClick={handleOnRegister}
            shape="round"
            size="large"
          >
            <UserAddOutlined /> Créez votre compte
          </Button>
        </div>
      </div>
    </div>
  );

  const handleOnRegister = () => {
    setLoading(true);
    setTimeout(() => {
      navigate(END_POINT_REGISTER);
    }, 1000);
  };

  const handleOnForgotPassword = () => {
    setLoading(true);
    setTimeout(() => {
      navigate(END_POINT_FORGOT_PASSWORD);
    }, 1000);
  }

  const handleOnValidate = () => {
    return !!email?.length && !!password?.length ? false : true;
  };

  const loginForm = () => (
    <div className="dct-talents-pulse-form">
      <div className="container">
        <Title level={2} className="dct-talents-pulse-secondary text-left">
          Identification
        </Title>
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
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col">
            <label htmlFor="password" className="dct-talents-pulse-secondary">
              Mot de passe <span className="dct-talents-pulse-field-required">*</span>
            </label>
            <Input.Password
              size="large"
              prefix={<KeyOutlined />}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              placeholder="Tapez un mot de passe"
              value={password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-12 mb-3">
            <Link
              onClick={handleOnForgotPassword}
              className="dct-talents-pulse-forgot-password dct-talents-pulse-secondary"
            >
              Mot de passe oublié ?
            </Link>
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
              disabled={handleOnValidate()}
            >
              <LoginOutlined /> Entrez
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await userAuthenticated(user)
      .then((res) => {
        console.log("userAuthenticated: ", res);
        if (res.status === 200) {
          // Set in localStorage
          talentsPulseSetUser(res.data);
          api.success({
            message: `Welcome back ${res.data?.user?.firstName} ${res.data?.user?.lastName}.`,
            description: "We are happy to see you again in talents-pulse DCT.",
            placement: "topRight",
          });
          if (!res.data?.user?.emailVerified) {
            navigate(END_POINT_PROFILE_COMPLETED);
          } else {
            setTimeout(() => {
              navigate(END_POINT_DASHBOARD);
            }, 1500);
          }
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
            {loginForm()}
            <div className="dct-talents-pulse-home-cta">
              <Divider className="auth-right-divider dct-talents-pulse-border-top-secondary">
                Nouveau candidat ?
              </Divider>
              {registerForm()}
            </div>
          </div>
        </div>
      </div>
    </Spin>
  );
};

export default LoginScreen;
