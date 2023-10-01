import React, { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../DashboardLayout";
import {
  Button,
  Divider,
  Drawer,
  Dropdown,
  Input,
  Menu,
  Popconfirm,
  Space,
  Switch,
  Table,
  Typography,
  notification,
  ColorPicker,
} from "antd";
import {
  DownOutlined,
  CheckOutlined,
  CloseOutlined,
  EditTwoTone,
  RestTwoTone,
  LeftOutlined,
  CheckCircleOutlined,
  PlusOutlined,
  ProjectOutlined,
  KeyOutlined,
} from "@ant-design/icons";

import {
  getListSectors,
  sectorAdd,
  sectorDelete,
  sectorEnableOrDisable,
} from "../../../services/sectorService";
import {
  ACTION_ACTIVE,
  ACTION_ADD,
  ACTION_EDIT,
} from "../../../utils/constants";
import slugify from "slugify";
import { talentsPulseCalculDiffDate, talentsPulseGetToken } from "../../../utils";
import TalentsPulseSearchItem from "../../../core/TalentsPulseSearchItem";

const SectorsScreen = () => {
  // States
  const [api, contextHolder] = notification.useNotification();
  const [keyword, setKeyword] = useState("");
  const [sector, setSector] = useState({
    name: "",
    code: "",
    colorRgb: "rgb(22, 119, 255)",
  });
  const [formatRgb, setFormatRgb] = useState("rgb");
  const [slug, setSlug] = useState("");
  const [sectors, setSectors] = useState([]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [action, setAction] = useState(ACTION_ADD);

  // Destructing
  const { Title } = Typography;
  const { name, code, colorRgb } = sector;

  // Init
  useEffect(() => {
    listSectors();
  }, []);

  const columns = [
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      sorter: {
        compare: (a, b) => a.code - b.code,
        multiple: 5,
      },
    },
    {
      title: "Pôle",
      dataIndex: "name",
      key: "name",
      sorter: {
        compare: (a, b) => a.name - b.name,
        multiple: 4,
      },
    },
    {
      title: "Color Rgb",
      dataIndex: "colorRgb",
      key: "colorRgb",
      render: (_, key) => (
        <Space size="middle">
          <ColorPicker value={key?.colorRgb} disabled />
        </Space>
      ),
    },
    {
      title: "Statut",
      dataIndex: "status",
      key: "status",
      render: (_, key) => (
        <Space size="middle">
          <Switch
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            defaultChecked={key.status === ACTION_ACTIVE ? true : false}
            onChange={() => handleEnableOrDisable(key)}
          />
        </Space>
      ),
    },
    {
      title: "Ajouté/Modifié par",
      dataIndex: "postedBy",
      key: "postedBy",
      sorter: {
        compare: (a, b) => a.postedBy - b.postedBy,
        multiple: 3,
      },
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
        <span onClick={() => handleOnEdit(key)}>
          <EditTwoTone /> Modifier
        </span>
      </Menu.Item>
      <Menu.Item key="2">
        <Popconfirm
          title="Are you sure you want to delete?"
          onConfirm={() => handleOnDelete(key)}
        >
          <span>
            <RestTwoTone /> Supprimer
          </span>
        </Popconfirm>
      </Menu.Item>
    </Menu>
  );

  // Functions
  const listSectors = () => {
    getListSectors()
      .then((res) => {
        let arrayItems = [];
        res.data.listSectors.map((sector, index) => {
          let obj = {
            key: (index + 1).toString(),
            code: sector.code,
            name: sector.name,
            colorRgb: sector.colorRgb,
            status: sector.status,
            postedBy:
              sector.postedBy.firstName + " " + sector.postedBy.lastName,
            createdAt: talentsPulseCalculDiffDate(sector.createdAt),
            updatedAt: talentsPulseCalculDiffDate(sector.updatedAt),
          };
          return arrayItems.push(obj);
        });
        setSectors(arrayItems);
      })
      .catch((error) => {
        console.log("SectorsScreen -> listSectors Error: ", error.response);
        api.error({
          message: "Erreur",
          description: error.response.data.message || error.response.data.error,
          placement: "topRight",
        });
      });
  };

  const handleEnableOrDisable = (sector) => {
    sectorEnableOrDisable(slugify(sector.name).toLowerCase(), talentsPulseGetToken())
      .then((res) => {
        api.success({
          message: "Succés",
          description: res.data.message,
          placement: "topRight",
        });
        listSectors();
      })
      .catch((error) => {
        console.log(
          "SectorsScreen -> handleEnableOrDisable Error: ",
          error.response
        );
        api.error({
          message: "Erreur",
          description: error.response.data.message || error.response.data.error,
          placement: "topRight",
        });
      });
  };

  const handleOnDelete = (e) => {
    sectorDelete(slugify(e.name), talentsPulseGetToken())
      .then((res) => {
        api.success({
          message: "Succés",
          description: res.data.message,
          placement: "topRight",
        });
        listSectors();
      })
      .catch((error) => {
        console.log("SectorsScreen -> handleOnDelete Error: ", error.response);
        api.error({
          message: "Erreur",
          description: error.response.data.message || error.response.data.error,
          placement: "topRight",
        });
      });
  };

  const handleOnAddSector = () => {
    setOpenDrawer(!openDrawer);
  };

  const handleOnCloseDrawer = () => {
    setOpenDrawer(!openDrawer);
    setAction(ACTION_ADD);
    setSector({});
  };

  const handleOnEdit = (e) => {
    setAction(ACTION_EDIT);
    handleOnAddSector();
    setSector({
      code: e.code,
      name: e.name,
      colorRgb: e.colorRgb,
    });
    setSlug(slugify(e.name).toLowerCase());
  };

  const handleOnChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  const searched = (keyword) => (c) => c.name.toLowerCase().includes(keyword);

  const handleOnSaveSector = async (e) => {
    e.preventDefault();
    await sectorAdd(
      { name, code, colorRgb: rgbString },
      talentsPulseGetToken(),
      action,
      slug
    )
      .then((res) => {
        api.success({
          message: "Succés",
          description: res.data.message,
          placement: "topRight",
        });
        handleOnCloseDrawer();
        listSectors();
      })
      .catch((error) => {
        console.log(
          "SectorsScreen -> handleOnSaveSector Error: ",
          error.response
        );
        api.error({
          message: "Erreur",
          description: error.response.data.message || error.response.data.error,
          placement: "topRight",
        });
      });
  };

  const rgbString = useMemo(
    () => (typeof colorRgb === "string" ? colorRgb : colorRgb?.toRgbString()),
    [colorRgb]
  );

  // Render
  return (
    <DashboardLayout defaultKey={"3"}>
      {contextHolder}
      <Button
        onClick={handleOnAddSector}
        type="primary"
        size="large"
        className="float-right dct-talents-pulse-btn-outline-secondary"
      >
        <PlusOutlined /> Nouveau Pôle
      </Button>
      <Drawer
        title={action === ACTION_ADD ? "Ajouter un pôle" : "Modifier le pôle"}
        placement="right"
        open={openDrawer}
        onClose={handleOnCloseDrawer}
        footer={
          <Space>
            <Button type="primary" danger onClick={handleOnCloseDrawer}>
              <LeftOutlined /> Retour
            </Button>
            <Button
              type="primary"
              onClick={handleOnSaveSector}
              disabled={!name?.length}
            >
              <CheckCircleOutlined />
              {action === ACTION_ADD ? "Enregistrez" : "Modifiez"}
            </Button>
          </Space>
        }
      >
        <div className="container-fluid">
          <div className="row">
            <div className="col mb-3">
              <label htmlFor="name">
                Code <span className="dct-talents-pulse-field-required">*</span>
              </label>
              <Input
                size="large"
                name="code"
                prefix={<KeyOutlined />}
                type="text"
                maxLength={2}
                placeholder="Code du pôle"
                value={code?.toLocaleUpperCase()}
                onChange={(e) => setSector({ ...sector, code: e.target.value })}
              />
            </div>
          </div>
          <div className="row">
            <div className="col mb-3">
              <label htmlFor="name">
                Pôle <span className="dct-talents-pulse-field-required">*</span>
              </label>
              <Input
                size="large"
                name="name"
                prefix={<ProjectOutlined />}
                type="text"
                placeholder="Nom du pôle"
                value={name}
                onChange={(e) => setSector({ ...sector, name: e.target.value })}
              />
            </div>
          </div>
          <div className="row">
            <div className="col mb-3">
              <label htmlFor="name">
                Background Color
                <span className="dct-talents-pulse-field-required">*</span>
              </label>
              <br />
              <ColorPicker
                format={formatRgb}
                value={colorRgb}
                onChange={(e) => setSector({ ...sector, colorRgb: e })}
                onFormatChange={setFormatRgb}
              />
            </div>
          </div>
        </div>
      </Drawer>
      <Title level={2} className="text-left dct-talents-pulse-secondary">
        Talents Pulse Pôles
      </Title>
      <Divider className="dct-talents-pulse-background-sliver" />
      <div className="row dct-talents-pulse-space-end">
        <div className="col-md-4 mb-3">
          <TalentsPulseSearchItem
            placeholder="Recherchez un pôle"
            keyword={keyword}
            setKeyword={setKeyword}
          />
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={sectors.filter(searched(keyword))}
        onChange={handleOnChange}
      />
    </DashboardLayout>
  );
};

export default SectorsScreen;
