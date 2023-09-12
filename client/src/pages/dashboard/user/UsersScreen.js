import React, { useEffect, useState } from "react";
import DashboardLayout from "../DashboardLayout";
import {
  Avatar,
  Button,
  Divider,
  Dropdown,
  Image,
  Menu,
  Popconfirm,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
  notification,
} from "antd";
import slugify from "slugify";
import {
  DownOutlined,
  EyeTwoTone,
  EditTwoTone,
  RestTwoTone,
  PlusOutlined,
} from "@ant-design/icons";
import {
  addNewMember,
  changeRoleAndStatusMember,
  getListUsers,
  userDelete,
} from "../../../services/userService";
import { ROLE_CANDIDATE } from "../../../utils/constants";
import TalentsPulseSearchItem from "../../../core/TalentsPulseSearchItem";
import {
  talentsPulseCalculDiffDate,
  talentsPulseGetRoleIcon,
  talentsPulseGetStatusColor,
  talentsPulseGetToken,
  isAdmin,
} from "../../../utils";
import AddMemberScreen from "./inc/AddMemberScreen";
import RoleAndStatusMemberScreen from "./inc/RoleAndStatusMemberScreen";
import ViewMemberScreen from "./inc/ViewMemberScreen";
import { getListCountriesFlags } from "../../../services/utilService";

const UsersScreen = () => {
  // States
  const [api, contextHolder] = notification.useNotification();
  const [keyword, setKeyword] = useState("");
  const [users, setUsers] = useState([]);
  const [countries, setCountries] = useState([]);
  const [member, setMember] = useState({});
  const [openAddDrawer, setOpenAddDrawer] = useState(false);
  const [openRoleDrawer, setOpenRoleDrawer] = useState(false);
  const [openViewDrawer, setOpenViewDrawer] = useState(false);

  // Destructing
  const { Title } = Typography;

  // Init
  useEffect(() => {
    listUsers();
    listCountriesFlags();
  }, []);

  const columns = [
    {
      title: "Nom et Prénom",
      dataIndex: "user",
      key: "user",
      render: (_, key) => (
        <Space wrap>
          {!!key.photoURL?.public_id?.length ? (
            <Image width={50} src={key.photoURL?.url} />
          ) : (
            <Avatar
              shape="square"
              className="dct-talents-pulse-background-primary dct-talents-pulse-white"
              size={50}
            >
              <b>
                {key?.firstName?.charAt(0)}
                {key?.lastName?.charAt(0)}
              </b>
            </Avatar>
          )}
          <div className="vertical">
            <div className="horizontal">
              <Title
                level={5}
                className="dct-talents-pulse-without-margin"
              >{`${key?.lastName} ${key?.firstName}`}</Title>
            </div>
            <i>{key?.email}</i>
          </div>
        </Space>
      ),
    },
    {
      title: "Pseudo",
      dataIndex: "pseudo",
      key: "pseudo",
      sorter: {
        compare: (a, b) => a.pseudo - b.pseudo,
        multiple: 5,
      },
    },
    {
      title: "Pays de résidence",
      dataIndex: "country",
      key: "country",
      render: (_, key) => (
        <Space wrap>
          <Tooltip title={key.country} placement="right">
            <Avatar
              shape="square"
              size="medium"
              src={
                countries?.find((country) => country.name === key.country)?.flag
              }
            />
          </Tooltip>
        </Space>
      ),
    },
    {
      title: "Rôle",
      dataIndex: "role",
      key: "role",
      render: (_, key) => (
        <Space size="middle">
          <Tag
            icon={talentsPulseGetRoleIcon(key.role)}
            color={talentsPulseGetStatusColor(key.role)}
          >
            {key.role}
          </Tag>
        </Space>
      ),
    },
    {
      title: "Statut",
      dataIndex: "status",
      key: "status",
      render: (_, key) => (
        <Space size="middle">
          <Tag
            className="dct-talents-pulse-border-radius-two"
            icon={talentsPulseGetRoleIcon(key.status)}
            color={talentsPulseGetStatusColor(key.status)}
          >
            {key.status}
          </Tag>
        </Space>
      ),
    },
    {
      title: "Créé le",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: {
        compare: (a, b) => a.createdAt - b.createdAt,
        multiple: 2,
      },
    },
    {
      title: "Modifié le",
      dataIndex: "updatedAt",
      key: "updatedAt",
      sorter: {
        compare: (a, b) => a.updatedAt - b.updatedAt,
        multiple: 1,
      },
    },
    {
      title: "Actions",
      key: "action",
      render: (_, key) => (
        <Space wrap>
          <Dropdown overlay={options(key)}>
            <Button type="primary" className="dct-talents-pulse-background-secondary">
              Selectionez <DownOutlined />
            </Button>
          </Dropdown>
        </Space>
      ),
    },
  ];

  const options = (key) => (
    <Menu>
      <Menu.Item key="1">
        <span onClick={() => handleOnShow(key)}>
          <EyeTwoTone /> Voir
        </span>
      </Menu.Item>
      {isAdmin() && (
        <>
          <Menu.Item key="2">
            <span onClick={() => handleOnChangeRole(key)}>
              <EditTwoTone /> Modifier
            </span>
          </Menu.Item>
          <Menu.Item key="3">
            <Popconfirm
              title="Are you sure you want to delete?"
              onConfirm={() => handleOnDelete(key)}
            >
              <span>
                <RestTwoTone /> Supprimer
              </span>
            </Popconfirm>
          </Menu.Item>
        </>
      )}
    </Menu>
  );

  // Functions
  const listUsers = () => {
    getListUsers(talentsPulseGetToken())
      .then((res) => {
        let arrayItems = [];
        res.data.listUsers
          .filter((user) => user.role !== ROLE_CANDIDATE)
          .map((user, index) => {
            let obj = {
              key: (index + 1).toString(),
              firstName: user.firstName,
              lastName: user.lastName,
              pseudo: user.pseudo,
              email: user.email,
              gender: user.gender,
              country: user.country,
              dateOfBorn: user.dateOfBorn,
              role: user.role,
              photoURL: user.photoURL,
              phoneNumber: user.phoneNumber,
              address: user.address,
              status: user.status,
              createdAt: talentsPulseCalculDiffDate(user.createdAt),
              updatedAt: talentsPulseCalculDiffDate(user.updatedAt),
            };
            return arrayItems.push(obj);
          });
        setUsers(arrayItems);
      })
      .catch((error) => {
        console.log("UsersScreen -> listUsers Error: ", error.response);
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
        console.log("UsersScreen -> listCountriesFlags Error: ", error);
      });
  };

  const handleOnChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  const searched = (keyword) => (c) =>
    c.firstName.toLowerCase().includes(keyword) ||
    c.lastName.toLowerCase().includes(keyword) ||
    c.pseudo.toLowerCase().includes(keyword) ||
    c.email.toLowerCase().includes(keyword);

  const handleOnShow = (user) => {
    setMember(user);
    setOpenViewDrawer(!openViewDrawer);
  };

  const handleOnDelete = (user) => {
    userDelete(slugify(user.lastName), talentsPulseGetToken())
      .then((res) => {
        api.success({
          message: "Succés",
          description: res.data.message,
          placement: "topRight",
        });
        listUsers();
      })
      .catch((error) => {
        console.log("UsersScreen -> handleOnDelete Error: ", error.response);
        api.error({
          message: "Erreur",
          description: error.response.data.message || error.response.data.error,
          placement: "topRight",
        });
      });
  };
  const handleOnChangeRole = (user) => {
    setMember(user);
    setOpenRoleDrawer(!openRoleDrawer);
  };

  const handleOnAddMember = () => {
    setOpenAddDrawer(!openAddDrawer);
  };

  const handleOnSaveMember = async (user) => {
    await addNewMember(user, talentsPulseGetToken())
      .then((res) => {
        api.success({
          message: "Succés",
          description: res.data.message,
          placement: "topRight",
        });
        handleOnAddMember();
        listUsers();
      })
      .catch((error) => {
        console.log(
          "UsersScreen -> handleOnSaveMember Error: ",
          error.response
        );
        api.error({
          message: "Erreur",
          description: error.response.data.message || error.response.data.error,
          placement: "topRight",
        });
      });
  };

  const handleOnCloseRoleDrawer = () => {
    setOpenRoleDrawer(!openRoleDrawer);
  };

  const handleOnCloseViewDrawer = () => {
    setOpenViewDrawer(!openViewDrawer);
  };

  const handleOnSaveRoleMember = async (user, role, status) => {
    await changeRoleAndStatusMember(user, role, status, talentsPulseGetToken())
      .then((res) => {
        api.success({
          message: "Succés",
          description: res.data.message,
          placement: "topRight",
        });
        handleOnCloseRoleDrawer();
        listUsers();
      })
      .catch((error) => {
        console.log(
          "UsersScreen -> handleOnSaveRoleMember Error: ",
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
    <DashboardLayout defaultKey={"2"}>
      {contextHolder}
      {isAdmin() && (
        <>
          <Button
            onClick={handleOnAddMember}
            type="primary"
            className="float-right"
          >
            <PlusOutlined /> Nouveau Membre
          </Button>
          <AddMemberScreen
            openAddDrawer={openAddDrawer}
            handleOnCloseAddDrawer={handleOnAddMember}
            handleOnSaveMember={handleOnSaveMember}
          />
          <RoleAndStatusMemberScreen
            user={member}
            openRoleDrawer={openRoleDrawer}
            handleOnCloseRoleDrawer={handleOnCloseRoleDrawer}
            handleOnSaveRoleMember={handleOnSaveRoleMember}
          />
        </>
      )}
      <ViewMemberScreen
        user={member}
        openViewDrawer={openViewDrawer}
        handleOnCloseViewDrawer={handleOnCloseViewDrawer}
      />
      <Title level={2} className="text-left dct-talents-pulse-secondary">
        Talents Pulse Membres
      </Title>
      <Divider className="dct-talents-pulse-background-sliver" />
      <div className="row dct-talents-pulse-space-end">
        <div className="col-md-4 mb-3">
          <TalentsPulseSearchItem
            placeholder="Recherchez un utilisateur"
            keyword={keyword}
            setKeyword={setKeyword}
          />
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={users.filter(searched(keyword))}
        onChange={handleOnChange}
      />
    </DashboardLayout>
  );
};

export default UsersScreen;
