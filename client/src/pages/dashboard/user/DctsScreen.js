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
  Progress,
  Select,
  Space,
  Spin,
  Table,
  Tooltip,
  Typography,
  notification,
} from "antd";
import {
  dctDelete,
  dctDownload,
  dctsFilter,
  getListDcts,
} from "../../../services/dctService";
import {
  talentsPulseCalculDiffDate,
  talentsPulseGetToken,
  talentsPulseProgressDct,
  isAdmin,
} from "../../../utils";
import {
  CloseCircleFilled,
  CloudTwoTone,
  DownOutlined,
  EditTwoTone,
  EyeTwoTone,
  PlusCircleTwoTone,
  RestTwoTone,
} from "@ant-design/icons";
import { getListSectors } from "../../../services/sectorService";
import { ACTION_ACTIVE } from "../../../utils/constants";
import { useNavigate, useParams } from "react-router-dom";
import {
  END_POINT_DASHBOARD_EDIT_DCT,
  END_POINT_DASHBOARD_VIEW_DCT,
} from "../../../routers/end-points";
import RoleAndStatusMemberScreen from "./inc/RoleAndStatusMemberScreen";
import { changeRoleAndStatusMember } from "../../../services/userService";
import TalentsPulseSearchItem from "../../../core/TalentsPulseSearchItem";

const DctsScreen = () => {
  // States
  const params = useParams();
  const completed = params.completed?.split("=")[1];
  const [api, contextHolder] = notification.useNotification();
  const [keyword, setKeyword] = useState("");
  const [dcts, setDcts] = useState([]);
  const [member, setMember] = useState({});
  const [tmpDcts, setTmpDcts] = useState([]); // For the filter
  const [sectors, setSectors] = useState([]);
  const [openRoleDrawer, setOpenRoleDrawer] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [filter, setFilter] = useState({
    sector: "",
    matricule: "",
    progression: "",
  });
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
    },
  });

  // Destructing
  const { Title } = Typography;
  const { Option } = Select;

  // Init
  useEffect(() => {
    listDcts();
    listSectors();
  }, []);

  useEffect(() => {
    handleOnCallFilter();
  }, [filter]);

  const columns = [
    {
      title: "Nom et Prénom",
      dataIndex: "user",
      key: "user",
      render: (_, key) => (
        <Space wrap>
          {!!key.user.photoURL?.public_id?.length ? (
            <Image width={50} src={key.user.photoURL?.url} />
          ) : (
            <Avatar
              shape="square"
              className="dct-talents-pulse-background-primary dct-talents-pulse-white"
              size={50}
            >
              <b>
                {key?.user.firstName?.charAt(0).toUpperCase()}
                {key?.user.lastName?.charAt(0).toUpperCase()}
              </b>
            </Avatar>
          )}
          <div className="vertical">
            <div className="horizontal">
              <Title
                level={5}
                className="dct-talents-pulse-without-margin"
              >{`${key?.user.lastName} ${key?.user.firstName}`}</Title>
            </div>
            <i>{key?.user.email}</i>
          </div>
        </Space>
      ),
    },
    {
      title: "Pôle",
      dataIndex: "sector",
      key: "createdAt",
      sorter: {
        compare: (a, b) => a.createdAt - b.createdAt,
        multiple: 4,
      },
    },
    {
      title: "Métier",
      dataIndex: "expertise",
      key: "expertise",
      sorter: {
        compare: (a, b) => a.createdAt - b.createdAt,
        multiple: 3,
      },
    },
    {
      title: "Progression",
      dataIndex: "progress",
      key: "progress",
      render: (_, key) => <Progress percent={talentsPulseProgressDct(key)} />,
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
            <Button
              type="primary"
              className="dct-talents-pulse-background-secondary"
            >
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
      {handleOnValidateDct(key) && (
        <Menu.Item key="2">
          <span onClick={() => handleOnDownload(key)}>
            <CloudTwoTone /> Download DCT
          </span>
        </Menu.Item>
      )}
      <Menu.Item key="3">
        <span onClick={() => handleOnUpdate(key)}>
          <EditTwoTone /> Modifier
        </span>
      </Menu.Item>
      {isAdmin() && (
        <>
          <Menu.Item key="4">
            <span onClick={() => handleOnPermissions(key)}>
              <PlusCircleTwoTone /> Permissions
            </span>
          </Menu.Item>
          <Menu.Item key="5">
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
  const listDcts = () => {
    setDcts([]);
    getListDcts(talentsPulseGetToken())
      .then((res) => {
        let arrayItems = [];
        res.data.listDcts.map((dct, index) => {
          let obj = {
            key: (index + 1).toString(),
            _id: dct._id,
            user: dct.user,
            email: dct.user?.email,
            country: dct.user?.country,
            sector: dct.sector?.name,
            expertise: dct?.expertiseUser || dct.expertise?.name,
            description: dct.description,
            skills: dct.skills,
            projectsDetail: dct.projectsDetail,
            formations: dct.formations,
            linguistics: dct.linguistics,
            createdAt: talentsPulseCalculDiffDate(dct.createdAt),
            updatedAt: talentsPulseCalculDiffDate(dct.updatedAt),
          };
          return arrayItems.push(obj);
        });

        if (completed !== undefined) {
          arrayItems = arrayItems.filter((dct) =>
            completed === "true"
              ? talentsPulseProgressDct(dct) === 100
              : talentsPulseProgressDct(dct) !== 100
          );
        }
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: arrayItems.length,
          },
        });
        setDcts(arrayItems);
        setTmpDcts(arrayItems);
      })
      .catch((error) => {
        console.log("DctsScreen -> listDcts Error: ", error.response);
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
        console.log("DctsScreen -> listSectors Error: ", error.response);
        api.error({
          message: "Erreur",
          description: error.response.data.message || error.response.data.error,
          placement: "topRight",
        });
      });
  };

  const handleOnShow = (dct) => {
    navigate(`${END_POINT_DASHBOARD_VIEW_DCT}/id=${dct._id}`);
  };

  const handleOnUpdate = (dct) => {
    navigate(`${END_POINT_DASHBOARD_EDIT_DCT}/id=${dct._id}`);
  };

  const handleOnDelete = async (dct) => {
    setLoading(true);
    await dctDelete(dct?._id, talentsPulseGetToken())
      .then((res) => {
        api.success({
          message: "Succès",
          description: res.data.message,
          placement: "topRight",
        });
        listDcts();
      })
      .catch((error) => {
        console.log("DctsScreen -> handleOnDelete Error: ", error.response);
        api.error({
          message: "Erreur",
          description: error.response.data.message || error.response.data.error,
          placement: "topRight",
        });
      });
    setLoading(false);
  };

  const handleOnPermissions = (user) => {
    setMember(user.user);
    setOpenRoleDrawer(!openRoleDrawer);
  };

  const handleOnCloseRoleDrawer = () => {
    setOpenRoleDrawer(!openRoleDrawer);
  };

  const handleOnDownload = async (dct) => {
    setLoading(true);
    await dctDownload(dct?._id, talentsPulseGetToken())
      .then((res) => {
        const nodeJSBuffer = res.data.doc;
        const buffer = Buffer.from(nodeJSBuffer);
        const blob = new Blob([buffer]);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        a.target = "_self";
        a.href = url;
        a.download = `${res.data.dct.user.firstName} ${res.data.dct.user.lastName}.docx`;
        a.click();
        window.URL.revokeObjectURL(url);
        api.success({
          message: "Success",
          description: res.data.message,
          placement: "topRight",
        });
      })
      .catch((error) => {
        console.log("DctsScreen -> handleOnDownload Error: ", error.response);
        api.error({
          message: "Erreur",
          description: error.response.data.message || error.response.data.error,
          placement: "topRight",
        });
      });
    setLoading(false);
  };

  const handleOnChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });

    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setDcts([]);
    }
  };

  const searched = (keyword) => (c) =>
    c.user?.firstName.toLowerCase().includes(keyword) ||
    c.user?.lastName.toLowerCase().includes(keyword) ||
    c.matricule.toLowerCase().includes(keyword) ||
    c.sector.toLowerCase().includes(keyword) ||
    c.expertise.toLowerCase().includes(keyword) ||
    c.email.toLowerCase().includes(keyword);

  const handleOnFilter = async (e, type) => {
    //setDcts(tmpDcts.filter((dct) => dct.sector === e));
    console.log(e, type);
    if (type === "sector") {
      setFilter({ ...filter, sector: e });
    }
    if (type === "matricule") {
      setFilter({ ...filter, matricule: e });
    }
    if (type === "progression") {
      setFilter({ ...filter, progression: e });
    }
  };

  const handleOnCallFilter = async () => {
    setLoading(true);
    await dctsFilter(filter, talentsPulseGetToken())
      .then((res) => {
        let arrayItems = [];
        res.data.listDcts.map((dct, index) => {
          let obj = {
            key: (index + 1).toString(),
            _id: dct._id,
            user: dct.user,
            email: dct.user?.email,
            country: dct.user?.country,
            sector: dct.sector?.name,
            expertise: dct.expertiseUser || dct.expertise?.name,
            description: dct.description,
            skills: dct.skills,
            projectsDetail: dct.projectsDetail,
            formations: dct.formations,
            linguistics: dct.linguistics,
            createdAt: talentsPulseCalculDiffDate(dct.createdAt),
            updatedAt: talentsPulseCalculDiffDate(dct.updatedAt),
          };
          return arrayItems.push(obj);
        });
        setDcts(arrayItems);
        setTmpDcts(arrayItems);
      })
      .catch((error) => {
        console.log("DctsScreen -> handleOnFilter Error: ", error.response);
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

  const handleOnSaveRoleMember = async (user, role, status) => {
    await changeRoleAndStatusMember(user, role, status, talentsPulseGetToken())
      .then((res) => {
        api.success({
          message: "Succés",
          description: res.data.message,
          placement: "topRight",
        });
        handleOnCloseRoleDrawer();
        listDcts();
      })
      .catch((error) => {
        console.log(
          "DctsScreen -> handleOnSaveRoleMember Error: ",
          error.response
        );
        api.error({
          message: "Erreur",
          description: error.response.data.message || error.response.data.error,
          placement: "topRight",
        });
      });
  };

  const handleOnValidateDct = (dct) => {
    const { description, skills, projectsDetail, formations, linguistics } =
      dct;
    return !!description?.length &&
      !!skills?.length &&
      !!projectsDetail?.length &&
      !!formations?.length &&
      !!linguistics?.length
      ? true
      : false;
  };

  // Render
  return (
    <Spin spinning={loading} size="large" tip="Loading">
      <DashboardLayout defaultKey={"5"}>
        {contextHolder}
        <Title level={2} className="text-left dct-talents-pulse-secondary">
          Talents Pulse Dcts
        </Title>
        <Divider className="dct-talents-pulse-background-sliver" />
        <div className="row dct-talents-pulse-space-between">
          <div className="col-md-8 mb-3">
            <div className="row">
              <div className="col-md-3 mb-3">
                <label
                  htmlFor="sector"
                  className="dct-talents-pulse-space-between"
                >
                  <span>Pôle</span>{" "}
                  <Tooltip placement="right" title={"Effacez le filtre"}>
                    <CloseCircleFilled
                      className="dct-talents-pulse-tomato"
                      onClick={() => handleOnFilter("", "sector")}
                    />
                  </Tooltip>
                </label>
                <Select
                  name="sector"
                  size="large"
                  showSearch
                  value={filter.sector}
                  style={{ width: "100%" }}
                  placeholder="Selectionez un pôle"
                  optionFilterProp="children"
                  onChange={(e) => handleOnFilter(e, "sector")}
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
              {/* <div className="col-md-2 mb-3">
                <label
                  htmlFor="matricule"
                  className="dct-talents-pulse-space-between"
                >
                  <span>Matricule</span>{" "}
                  <Tooltip placement="right" title={"Effacez le filtre"}>
                    <CloseCircleFilled
                      className="dct-talents-pulse-tomato"
                      onClick={() => handleOnFilter("", "matricule")}
                    />
                  </Tooltip>
                </label>
                <Select
                  name="matricule"
                  size="large"
                  showSearch
                  value={filter.matricule}
                  style={{ width: "100%" }}
                  placeholder="Choisisez par matricule"
                  optionFilterProp="children"
                  onChange={(e) => handleOnFilter(e, "matricule")}
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  options={[
                    { value: "OK", label: "Oui" },
                    { value: "KO", label: "Non" },
                  ]}
                />
              </div> */}
              {/* <div className="col-md-4 mb-3">
            <label htmlFor="progression" className="dct-talents-pulse-space-between">
              <span>Progression</span>{" "}
              <Tooltip placement="right" title={"Effacez le filtre"}>
                <CloseCircleFilled
                  className="dct-talents-pulse-tomato"
                  onClick={() => handleOnFilter("", "progression")}
                />
              </Tooltip>
            </label>
            <Select
              name="progression"
              size="large"
              showSearch
              value={filter.progression}
              style={{ width: "100%" }}
              placeholder="Choisisez par progression"
              optionFilterProp="children"
              onChange={(e) => handleOnFilter(e, "progression")}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              options={[
                { value: "OK", label: "100%" },
                { value: "KO", label: "En cours" },
              ]}
            />
          </div> */}
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <TalentsPulseSearchItem
              placeholder="Recherchez un candidat"
              keyword={keyword}
              setKeyword={setKeyword}
            />
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={dcts.filter(searched(keyword))}
          pagination={tableParams.pagination}
          onChange={handleOnChange}
        />
        <RoleAndStatusMemberScreen
          user={member}
          openRoleDrawer={openRoleDrawer}
          handleOnCloseRoleDrawer={handleOnCloseRoleDrawer}
          handleOnSaveRoleMember={handleOnSaveRoleMember}
        />
      </DashboardLayout>
    </Spin>
  );
};

export default DctsScreen;
