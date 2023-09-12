import React, { useEffect, useState } from "react";
import DashboardLayout from "../dashboard/DashboardLayout";
import { talentsPulseGetToken, talentsPulseGetUser, talentsPulseRemoveToken } from "../../utils";
import { Button, Divider, Input, Modal, Typography, notification } from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  KeyOutlined,
  LeftOutlined,
  UnlockFilled,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  END_POINT_DASHBOARD,
  END_POINT_DASHBOARD_PROFILE,
  END_POINT_LOGIN,
} from "../../routers/end-points";
import { userChangePassword } from "../../services/authService";

const ChangePasswordScreen = () => {
  // States
  const [api, contextHolder] = notification.useNotification();
  const [user, setUser] = useState({});
  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  // Init
  useEffect(() => {
    setUser(talentsPulseGetUser());
  }, []);

  // Destructing
  const { Title } = Typography;
  const { currentPassword, newPassword, confirmPassword } = password;

  // Functions
  const handleOnSubmit = async (e) => {
    e.preventDefault();

    if (handleOnVerifyPassword()) {
      await userChangePassword(password, talentsPulseGetToken())
        .then((res) => {
          if (res.status === 200) {
            talentsPulseRemoveToken();
            Modal.success({
              title: "Confirmation changement mot de passe.",
              content: (
                <div>
                  <p>
                    Bingo {res.data.user.firstName} {res.data.user.lastName}
                    !!! Vous avec échanger votre mot de passe avec succés.
                  </p>
                  <p>
                    Pour continuer sur la plateforme, vous deviez vous
                    déconnecter et refaire le login avec le nouveau mot de
                    passe.
                  </p>
                </div>
              ),
              onOk() {
                handleOnLogin();
              },
            });
          }
        })
        .catch((error) => {
          console.log(
            "ChangePasswordScreen -> userChangePassword error: ",
            error
          );
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
          "Nouveau Mot de Passe et Confimation Mot de passe ne sont pas identiques. Essaies de nouveau.",
        placement: "topRight",
      });
    }
  };

  const handleOnLogin = () => {
    navigate(END_POINT_LOGIN);
  };

  const handleOnVerifyPassword = () => {
    return newPassword === confirmPassword ? true : false;
  };

  const handleOnChange = (e) => {
    setPassword({
      ...password,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnValidate = () => {
    return !!currentPassword?.length &&
      !!newPassword?.length &&
      !!confirmPassword?.length
      ? false
      : true;
  };

  // Render
  return (
    <DashboardLayout>
      {contextHolder}
      <div className="container-fluid">
        <Title level={2}>Modification Mot de Passe</Title>
        <Divider />
        <div className="row dct-talents-pulse-space-center">
          <div className="col-md-6">
            <form onSubmit={handleOnSubmit} className="dct-talents-pulse-form">
              <div className="container">
                <div className="row mb-3">
                  <div className="col mb-3">
                    <label htmlFor="currentPassword">
                      Mot de Passe actuel
                      <span className="dct-talents-pulse-field-required">*</span>
                    </label>
                    <Input.Password
                      size="large"
                      name="currentPassword"
                      prefix={<KeyOutlined />}
                      iconRender={(visible) =>
                        visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                      }
                      placeholder="Votre mot de passe actuel"
                      value={currentPassword}
                      onChange={handleOnChange}
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col mb-3">
                    <label htmlFor="newPassword">
                      Nouveau Mot de Passe
                      <span className="dct-talents-pulse-field-required">*</span>
                    </label>
                    <Input.Password
                      size="large"
                      name="newPassword"
                      prefix={<KeyOutlined />}
                      iconRender={(visible) =>
                        visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                      }
                      placeholder="Votre nouveau mot de passe"
                      value={newPassword}
                      onChange={handleOnChange}
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col mb-3">
                    <label htmlFor="confirmPassword">
                      Confirmation Mot de Passe
                      <span className="dct-talents-pulse-field-required">*</span>
                    </label>
                    <Input.Password
                      size="large"
                      name="confirmPassword"
                      prefix={<KeyOutlined />}
                      iconRender={(visible) =>
                        visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                      }
                      placeholder="Confirmez votre mot de passe"
                      value={confirmPassword}
                      onChange={handleOnChange}
                    />
                  </div>
                </div>
                <div className="row mt-4">
                  <div className="col">
                    <Button
                      type="primary"
                      className="mb-3 dct-talents-pulse-btn-tomato"
                      block
                      shape="round"
                      size="large"
                      onClick={() => navigate(END_POINT_DASHBOARD_PROFILE)}
                    >
                      <LeftOutlined /> Retour
                    </Button>
                  </div>
                  <div className="col">
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="mb-3 dct-talents-pulse-btn-secondary"
                      block
                      shape="round"
                      size="large"
                      disabled={handleOnValidate()}
                    >
                      <UnlockFilled /> Modifier
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ChangePasswordScreen;
