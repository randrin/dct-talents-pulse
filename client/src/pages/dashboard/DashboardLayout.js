import React, { useEffect, useState } from "react";
import {
  ExclamationCircleFilled,
  KeyOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PlusOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Dropdown,
  Layout,
  Menu,
  Modal,
  Progress,
  Space,
  Spin,
  Tooltip,
  notification,
  theme,
} from "antd";
import {
  END_POINT_DASHBOARD,
  END_POINT_DASHBOARD_CREATE_DCT,
  END_POINT_DASHBOARD_STEPS_DCT,
  END_POINT_HOME,
  END_POINT_LOGIN,
} from "../../routers/end-points";
import {
  talentsPulseGetToken,
  talentsPulseProgressDct,
  talentsPulseRemoveToken,
  isAdmin,
  isMember,
} from "../../utils";
import {
  CREATED_DCT_TALENTS_PULSE,
  KEY_FULLNAME,
  KEY_LOGOUT,
  KEY_PASSWORD,
  KEY_PROFILE,
  ROLE_ADMIN,
  ROLE_CANDIDATE,
  ROLE_MEMBER,
} from "../../utils/constants";
import { Link, useNavigate } from "react-router-dom";
import {
  TALENTS_PULSE_NAVBAR_CANDIDATE,
  TALENTS_PULSE_NAVBAR_CUSTOMER,
  TALENTS_PULSE_NAVBAR_MEMBER,
} from "../../utils/navbarRole";
import { userByToken } from "../../services/userService";
import { getDctByUser } from "../../services/dctService";

const DashboardLayout = ({ defaultKey, children }) => {
  // States
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);
  const [showBtnDct, setShowBtnDct] = useState(true);
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
  });
  const [dct, setDct] = useState({});
  const currentYear = new Date().getFullYear();
  const createdYear = CREATED_DCT_TALENTS_PULSE;
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  // Destructing
  const { firstName, lastName, photoURL, role } = user;
  const { Header, Sider, Footer, Content } = Layout;
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { confirm } = Modal;

  // Init
  useEffect(() => {
    let token = talentsPulseGetToken();
    handleOnVerifyToken(token);
    if (!token) navigate(END_POINT_LOGIN);
    if (role === ROLE_CANDIDATE) {
      findDct();
    }
    setShowBtnDct(
      !window.location.pathname.includes("/create-dct") &&
        !window.location.pathname.includes("/steps-dct") &&
        !window.location.pathname.includes("/edit/dct")
    );
  }, [role]);

  const items = [
    {
      label: `${firstName} ${lastName}`,
      key: KEY_FULLNAME,
      disabled: true,
    },
    {
      label: "Mon Profil",
      key: KEY_PROFILE,
      icon: <UserOutlined />,
    },
    {
      label: "Changer Mot de Passe",
      key: KEY_PASSWORD,
      icon: <KeyOutlined />,
    },
    {
      label: "Logout",
      key: KEY_LOGOUT,
      icon: <LogoutOutlined />,
      danger: true,
    },
  ];

  const menuProps = {
    items,
    onClick: (e) => handleMenuClick(e),
  };

  // Functions
  const handleOnVerifyToken = async (token) => {
    setLoading(true);
    await userByToken(token)
      .then((res) => {
        setTimeout(() => {
          setUser(res.data.user);
          setLoading(false);
        }, 1000);
      })
      .catch((error) => {
        console.log("DashboardLayout -> userByToken error: ", error);
        setTimeout(() => {
          talentsPulseRemoveToken();
          navigate(END_POINT_LOGIN);
        }, 2000);
      });
  };

  const findDct = async () => {
    await getDctByUser(talentsPulseGetToken())
      .then((res) => {
        setDct(res.data.dct);
      })
      .catch((error) => {
        console.log("DashboardLayout -> findDct Error: ", error.response);
        api.error({
          message: "Erreur",
          description: error.response.data.message || error.response.data.error,
          placement: "topRight",
        });
      });
  };

  const handleMenuClick = (e) => {
    if (e.key === KEY_LOGOUT) {
      confirm({
        title: "Confirmation Logout",
        icon: <ExclamationCircleFilled />,
        okText: "Oui",
        cancelText: "Non",
        content: "Êtes-vous sûr de vouloir vous déconnectez du DCT ?",
        onOk() {
          talentsPulseRemoveToken();
          navigate(END_POINT_LOGIN);
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    } else {
      navigate(`${END_POINT_DASHBOARD}/${e.key}`);
    }
  };

  const handleOnCreateDct = () => {
    navigate(END_POINT_DASHBOARD_CREATE_DCT);
  };

  // Render
  return (
    <Spin spinning={loading} size="large" tip="Loading">
      <Layout className="dct-dashboard-layout-wrapper">
        {contextHolder}
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          className="dct-dashboard-sider"
        >
          <div className="dct-logo">
            <Link className="dct-logo-link" to={END_POINT_DASHBOARD}>
              <img
                className={`${collapsed ? "dct-logo-small" : ""}`}
                src="/assets/images/logo talents pulse.png"
                alt="Logo Talents Pulse"
              />
            </Link>
          </div>
          <Menu
            className="dct-navigation"
            theme="dark"
            mode="inline"
            defaultSelectedKeys={[defaultKey]}
            items={
              role === ROLE_CANDIDATE
                ? TALENTS_PULSE_NAVBAR_CANDIDATE
                : role === ROLE_MEMBER || role === ROLE_ADMIN
                ? TALENTS_PULSE_NAVBAR_MEMBER
                : TALENTS_PULSE_NAVBAR_CUSTOMER
            }
          />
          {(isAdmin() || isMember()) && showBtnDct && (
            <>
              {collapsed ? (
                <Tooltip placement="right" title={"Create DCT"}>
                  <Button
                    type="primary"
                    className="dct-talents-pulse-btn-bottom dct-talents-pulse-btn-outline-primary"
                    block
                    onClick={handleOnCreateDct}
                    shape="round"
                    size="large"
                  >
                    <PlusOutlined />
                  </Button>
                </Tooltip>
              ) : (
                <Button
                  type="primary"
                  className="dct-talents-pulse-btn-bottom dct-talents-pulse-btn-outline-primary"
                  block
                  onClick={handleOnCreateDct}
                  shape="round"
                  size="large"
                >
                  <PlusOutlined /> Create DCT
                </Button>
              )}
            </>
          )}
        </Sider>
        <Layout className="site-layout dct-dashboard-layout">
          <Header
            className="dct-dashboard-layout-header dct-talents-pulse-space-between"
            style={{
              padding: 0,
              background: colorBgContainer,
            }}
          >
            <div className="trigger" onClick={() => setCollapsed(!collapsed)}>
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </div>
            {role === ROLE_CANDIDATE && (
              <div className="dct-dashboard-layout-header-progress">
                <span>Progression de votre DCT</span>
                <Progress percent={talentsPulseProgressDct(dct)}></Progress>
              </div>
            )}
            <Space wrap className="dct-dashboard-layout-header-profile">
              <Dropdown menu={menuProps}>
                {!!photoURL?.public_id?.length ? (
                  <Avatar
                    key={photoURL?.public_id}
                    src={photoURL?.url}
                    size={50}
                    shape="square"
                  />
                ) : (
                  <Avatar
                    shape="square"
                    className="dct-talents-pulse-background-primary dct-talents-pulse-white"
                    size={50}
                  >
                    <b>
                      {firstName.charAt(0)}
                      {lastName.charAt(0)}
                    </b>
                  </Avatar>
                )}
              </Dropdown>
            </Space>
          </Header>
          <Content
            style={{
              margin: "24px 15px 0 15px",
              padding: window.location.pathname.includes(
                END_POINT_DASHBOARD_STEPS_DCT
              )
                ? 0
                : 24,
              //overflow: "auto",
              background: colorBgContainer,
            }}
          >
            {children}
          </Content>
          <Footer
            style={{
              textAlign: "center",
            }}
          >
            <div className="copyright">
              <span>Copyright ©</span>
              <span>
                {currentYear > createdYear ? (
                  <span>
                    {createdYear} - {currentYear}
                  </span>
                ) : (
                  createdYear
                )}
              </span>
              .
              <a
                target="_blank"
                href={END_POINT_HOME}
                className="m-1 dct-talents-pulse-primary"
                rel="noreferrer"
              >
                Talents Pulse
              </a>
            </div>
          </Footer>
        </Layout>
      </Layout>
    </Spin>
  );
};
export default DashboardLayout;
