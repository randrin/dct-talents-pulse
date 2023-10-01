import React, { useEffect, useMemo, useState } from "react";
import slugify from "slugify";
import DashboardLayout from "../DashboardLayout";
import {
  Button,
  ColorPicker,
  Divider,
  Drawer,
  Dropdown,
  Input,
  Menu,
  Popconfirm,
  Select,
  Space,
  Switch,
  Table,
  Tooltip,
  Typography,
  notification,
} from "antd";
import TalentsPulseSearchItem from "../../../core/TalentsPulseSearchItem";
import {
  ACTION_ACTIVE,
  ACTION_ADD,
  ACTION_EDIT,
} from "../../../utils/constants";
import {
  DownOutlined,
  CheckOutlined,
  CloseOutlined,
  EditTwoTone,
  RestTwoTone,
  LeftOutlined,
  CheckCircleOutlined,
  PlusOutlined,
  WalletOutlined,
  CloseCircleFilled,
} from "@ant-design/icons";
import {
  talentsPulseCalculDiffDate,
  talentsPulseGetToken,
} from "../../../utils";
import {
  expertiseAdd,
  expertiseDelete,
  expertiseEnableOrDisable,
  getListExpertises,
} from "../../../services/expertiseService";
import { getListSectors } from "../../../services/sectorService";

const ExpertisesScreen = () => {
  // States
  const [api, contextHolder] = notification.useNotification();
  const [keyword, setKeyword] = useState("");
  const [expertise, setExpertise] = useState({
    name: "",
    colorRgb: "rgb(22, 119, 255)",
    parent: "",
  });
  const [formatRgb, setFormatRgb] = useState("rgb");
  const [slug, setSlug] = useState("");
  const [expertises, setExpertises] = useState([]);
  const [tmpExpertises, setTmpExpertises] = useState([]); // For the filter
  const [sectors, setSectors] = useState([]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [action, setAction] = useState(ACTION_ADD);

  // Destructing
  const { Title } = Typography;
  const { Option } = Select;
  const { name, colorRgb, parent } = expertise;

  // Init
  useEffect(() => {
    listExpertises();
    listSectors();
  }, []);

  const columns = [
    {
      title: "Métier",
      dataIndex: "name",
      key: "name",
      sorter: {
        compare: (a, b) => a.name - b.name,
        multiple: 4,
      },
    },
    {
      title: "Pôle",
      dataIndex: "parent",
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
      title: "Ajouté/Modifié par",
      dataIndex: "postedBy",
      key: "postedBy",
      sorter: {
        compare: (a, b) => a.postedBy - b.postedBy,
        multiple: 3,
      },
      responsive: ["md"],
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
      responsive: ["md"],
    },
    {
      title: "Créé le",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: {
        compare: (a, b) => a.createdAt - b.createdAt,
        multiple: 2,
      },
      responsive: ["md"],
    },
    {
      title: "Modifié le",
      dataIndex: "updatedAt",
      key: "updatedAt",
      sorter: {
        compare: (a, b) => a.updatedAt - b.updatedAt,
        multiple: 1,
      },
      responsive: ["md"],
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
        setSectors(
          res.data.listSectors?.filter(
            (sector) => sector.status === ACTION_ACTIVE
          )
        );
      })
      .catch((error) => {
        console.log("ExpertisesScreen -> listSectors Error: ", error.response);
        api.error({
          message: "Erreur",
          description: error.response.data.message || error.response.data.error,
          placement: "topRight",
        });
      });
  };

  const listExpertises = () => {
    getListExpertises()
      .then((res) => {
        let arrayItems = [];
        res.data.listExpertises.map((expertise, index) => {
          let obj = {
            key: (index + 1).toString(),
            name: expertise.name,
            colorRgb: expertise.colorRgb,
            parent: expertise.parent.name,
            status: expertise.status,
            postedBy:
              expertise.postedBy.firstName + " " + expertise.postedBy.lastName,
            createdAt: talentsPulseCalculDiffDate(expertise.createdAt),
            updatedAt: talentsPulseCalculDiffDate(expertise.updatedAt),
          };
          return arrayItems.push(obj);
        });
        setExpertises(arrayItems);
        setTmpExpertises(arrayItems);
      })
      .catch((error) => {
        console.log(
          "ExpertisesScreen -> listExpertises Error: ",
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
    expertiseDelete(slugify(e.name), talentsPulseGetToken())
      .then((res) => {
        api.success({
          message: "Succés",
          description: res.data.message,
          placement: "topRight",
        });
        listExpertises();
      })
      .catch((error) => {
        console.log(
          "ExpertisesScreen -> handleOnDelete Error: ",
          error.response
        );
        api.error({
          message: "Erreur",
          description: error.response.data.message || error.response.data.error,
          placement: "topRight",
        });
      });
  };

  const handleEnableOrDisable = (expertise) => {
    expertiseEnableOrDisable(
      slugify(expertise.name).toLowerCase(),
      talentsPulseGetToken()
    )
      .then((res) => {
        api.success({
          message: "Succés",
          description: res.data.message,
          placement: "topRight",
        });
        listExpertises();
      })
      .catch((error) => {
        console.log(
          "ExpertisesScreen -> handleEnableOrDisable Error: ",
          error.response
        );
        api.error({
          message: "Erreur",
          description: error.response.data.message || error.response.data.error,
          placement: "topRight",
        });
      });
  };

  const handleOnAddExpertise = () => {
    setOpenDrawer(!openDrawer);
  };

  const handleOnCloseDrawer = () => {
    setOpenDrawer(!openDrawer);
    setAction(ACTION_ADD);
    setExpertise({});
  };

  const handleOnEdit = (e) => {
    console.log(e, sectors);
    setAction(ACTION_EDIT);
    handleOnAddExpertise();
    setExpertise({
      name: e.name,
      colorRgb: e.colorRgb,
      parent: sectors.find((sector) => sector.name === e.parent)?._id,
    });
    setSlug(slugify(e.name).toLowerCase());
  };

  const handleOnChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  const searched = (keyword) => (c) => c.name.toLowerCase().includes(keyword);

  const handleOnSaveExpertise = async (e) => {
    e.preventDefault();
    await expertiseAdd(
      { name, parent, colorRgb: rgbString },
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
        listExpertises();
      })
      .catch((error) => {
        console.log(
          "ExpertisesScreen -> handleOnSaveExpertise Error: ",
          error.response
        );
        api.error({
          message: "Erreur",
          description: error.response.data.message || error.response.data.error,
          placement: "topRight",
        });
      });
  };

  const handleOnFilter = (e) => {
    setExpertises(tmpExpertises.filter((expertise) => expertise.parent === e));
  };

  const rgbString = useMemo(
    () => (typeof colorRgb === "string" ? colorRgb : colorRgb?.toRgbString()),
    [colorRgb]
  );

  // Render
  return (
    <DashboardLayout defaultKey={"4"}>
      {contextHolder}
      <Button
        onClick={handleOnAddExpertise}
        type="primary"
        size="large"
        className="float-right dct-talents-pulse-btn-outline-secondary"
      >
        <PlusOutlined /> Nouveau Métier
      </Button>
      <Drawer
        title={
          action === ACTION_ADD ? "Ajouter un métier" : "Modifier le métier"
        }
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
              disabled={!!name?.length && !!parent?.length ? false : true}
              onClick={handleOnSaveExpertise}
            >
              <CheckCircleOutlined />
              {action === ACTION_ADD ? "Enregistrez" : "Modifiez"}
            </Button>
          </Space>
        }
      >
        <div className="container-fluid">
          <div className="row">
            <div className="col mb-4">
              <label htmlFor="sector">
                Pôle <span className="dct-talents-pulse-field-required">*</span>
              </label>
              <Select
                name="sector"
                size="large"
                showSearch
                style={{ width: "100%" }}
                placeholder="Selectionez un pôle"
                optionFilterProp="children"
                value={parent}
                onChange={(e) => setExpertise({ ...expertise, parent: e })}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
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
                Métier <span className="dct-talents-pulse-field-required">*</span>
              </label>
              <Input
                size="large"
                name="expertise"
                prefix={<WalletOutlined />}
                type="text"
                placeholder="Nom du métier"
                value={name}
                onChange={(e) =>
                  setExpertise({ ...expertise, name: e.target.value })
                }
              />
            </div>
          </div>
          <div className="row">
            <div className="col mb-3">
              <label htmlFor="name">
                Background Color{" "}
                <span className="dct-talents-pulse-field-required">*</span>
              </label>
              <br />
              <ColorPicker
                format={formatRgb}
                value={colorRgb}
                onChange={(e) => setExpertise({ ...expertise, colorRgb: e })}
                onFormatChange={setFormatRgb}
              />
            </div>
          </div>
        </div>
      </Drawer>
      <Title level={2} className="text-left dct-talents-pulse-secondary">
        Talents Pulse Métiers par pôles
      </Title>
      <Divider className="dct-talents-pulse-background-sliver" />
      <div className="row dct-talents-pulse-space-between">
        <div className="col-md-2 mb-3">
          <label htmlFor="filter" className="dct-talents-pulse-space-between">
            <span>Filtre par pôle</span>{" "}
            <Tooltip placement="right" title={"Effacez le filtre"}>
              <CloseCircleFilled
                className="dct-talents-pulse-tomato"
                onClick={listExpertises}
              />
            </Tooltip>
          </label>
          <Select
            name="filter"
            size="large"
            showSearch
            style={{ width: "100%" }}
            placeholder="Selectionez un pôle"
            optionFilterProp="children"
            onChange={handleOnFilter}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {sectors.map((sector, index) => (
              <Option key={index} value={sector.name}>
                {sector.name}
              </Option>
            ))}
          </Select>
        </div>
        <div className="col-md-4 mb-3">
          <TalentsPulseSearchItem
            placeholder="Recherchez un métier"
            keyword={keyword}
            setKeyword={setKeyword}
          />
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={expertises.filter(searched(keyword))}
        onChange={handleOnChange}
      />
    </DashboardLayout>
  );
};

export default ExpertisesScreen;
