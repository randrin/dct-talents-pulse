import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Divider,
  Row,
  Space,
  Statistic,
  Table,
  Typography,
  notification,
} from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import {
  talentsPulseCalculDiffDate,
  talentsPulseGetToken,
  talentsPulseProgressDct,
} from "../../../utils";
import { getListDcts } from "../../../services/dctService";
import { Link, useNavigate } from "react-router-dom";
import {
  END_POINT_DASHBOARD_DCTS,
  END_POINT_DASHBOARD_USERS,
  END_POINT_DASHBOARD_VIEW_DCT,
} from "../../../routers/end-points";
import DashboardLayout from "../DashboardLayout";
import { getListUsers } from "../../../services/userService";
import {
  ACTION_ACTIVE,
  DEFAULT_PASSWORD,
  ROLE_CANDIDATE,
} from "../../../utils/constants";
import WidgetBarScreen from "../widgets/WidgetBarScreen";
import WidgetDoughnutScreen from "../widgets/WidgetDoughnutScreen";
import WidgetPieScreen from "../widgets/WidgetPieScreen";
import { getListSectors } from "../../../services/sectorService";
import Marquee from "react-fast-marquee";
import * as _ from "lodash/fp";

const DashboardUserScreen = () => {
  // States
  const [api, contextHolder] = notification.useNotification();
  const [dcts, setDcts] = useState([]);
  const [dctsTable, setDctsTable] = useState([]);
  const [users, setUsers] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [dctsOk, setDctsOk] = useState([]);
  const [dctsKo, setDctsKo] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [expertises, setExpertises] = useState([]);
  const navigate = useNavigate();

  // Destructing
  const { Title } = Typography;

  // Init
  useEffect(() => {
    listDcts();
    listUsers();
    listSectors();
  }, []);

  useEffect(() => {
    listExpertises();
  }, [dcts]);

  const columns = [
    {
      title: "Nom et Prénom",
      dataIndex: "user",
      key: "user",
      sorter: {
        compare: (a, b) => a.user - b.user,
        multiple: 7,
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: {
        compare: (a, b) => a.email - b.email,
        multiple: 6,
      },
    },
    {
      title: "Pôle",
      dataIndex: "sector",
      key: "sector",
      sorter: {
        compare: (a, b) => a.sector - b.sector,
        multiple: 5,
      },
    },
    {
      title: "Métier",
      dataIndex: "expertise",
      key: "expertise",
      sorter: {
        compare: (a, b) => a.expertise - b.expertise,
        multiple: 4,
      },
    },
    {
      title: "Nbr. d'expériences",
      dataIndex: "expNumber",
      key: "expNumber",
      sorter: {
        compare: (a, b) => a.expNumber - b.expNumber,
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
          <Button
            type="primary"
            className="dct-talents-pulse-btn-secondary"
            onClick={() =>
              navigate(`${END_POINT_DASHBOARD_VIEW_DCT}/id=${key._id}`)
            }
          >
            Voir <ArrowRightOutlined />
          </Button>
        </Space>
      ),
    },
  ];

  // Functions
  const listUsers = () => {
    getListUsers(talentsPulseGetToken())
      .then((res) => {
        setUsers(
          res.data.listUsers.filter((user) => user.role !== ROLE_CANDIDATE)
        );
        setCandidates(
          res.data.listUsers.filter((user) => user.role === ROLE_CANDIDATE)
        );
      })
      .catch((error) => {
        console.log("DashboardUserScreen -> listUsers Error: ", error.response);
        api.error({
          message: "Erreur",
          description: error.response.data.message || error.response.data.error,
          placement: "topRight",
        });
      });
  };

  const listDcts = () => {
    getListDcts(talentsPulseGetToken())
      .then((res) => {
        let arrayItems = [];
        setDctsOk(
          res.data.listDcts.filter((dct) => talentsPulseProgressDct(dct) === 100)
        );
        setDctsKo(
          res.data.listDcts.filter((dct) => talentsPulseProgressDct(dct) !== 100)
        );
        setDcts(res.data.listDcts);
        res.data.listDcts.slice(0, 5).map((dct, index) => {
          let obj = {
            key: (index + 1).toString(),
            _id: dct._id,
            sector: dct.sector.name,
            expertise: dct.expertiseUser || dct.expertise.name,
            user: dct.user.firstName + " " + dct.user.lastName,
            email: dct.user.email,
            expNumber: dct.expNumber,
            createdAt: talentsPulseCalculDiffDate(dct.createdAt),
            updatedAt: talentsPulseCalculDiffDate(dct.updatedAt),
          };
          return arrayItems.push(obj);
        });
        setDctsTable(arrayItems);
      })
      .catch((error) => {
        console.log("DashboardUserScreen -> listDcts Error: ", error.response);
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
          res.data.listSectors.filter(
            (sector) => sector.status === ACTION_ACTIVE
          )
        );
      })
      .catch((error) => {
        console.log(
          "DashboardUserScreen -> listSectors Error: ",
          error.response
        );
        api.error({
          message: "Erreur",
          description: error.response.data.message || error.response.data.error,
          placement: "topRight",
        });
      });
  };

  const listExpertises = () => {
    setExpertises(
      _.uniqWith(
        _.isEqual,
        dcts.map((dct) => dct.expertise)
      )
    );
  };

  const descriptionAlert = () => (
    <h6>
      A' partir du <b>17/07/2023</b>, lors de la création d'un dossier de
      compétences techniques du candidat, ce dernier pourra se connecter à son
      dossier et effectuer également des modifications avec les identifiants
      suivants: Email:{" "}
      <b>
        <i>Fournir lors de la création du profil</i>
      </b>
      , Mot de passe:{" "}
      <b>
        <i>{DEFAULT_PASSWORD}</i>
      </b>
      .{" "}
    </h6>
  );

  // Render
  return (
    <DashboardLayout defaultKey={"1"} className="dct-dashboard-wrapper">
      {contextHolder}
      <div
        className="row"
        style={{
          margin: "0px 0px 15px",
        }}
      >
        <div className="col">
          <Alert
            type="info"
            banner
            message={
              <Marquee pauseOnHover gradient={false}>
                {descriptionAlert()}
              </Marquee>
            }
          />
        </div>
      </div>
      <div className="container-fluid">
        <Title level={2} className="text-left dct-talents-pulse-secondary">
          Tableau de bord
        </Title>
        <Divider className="dct-talents-pulse-background-sliver" />
        <Row className="mt-5" gutter={16}>
          <Col span={6}>
            <Card bordered={false}>
              <Link
                className="ant-card-body-link"
                to={END_POINT_DASHBOARD_USERS}
              >
                <Statistic
                  title="Membres Talents Pulse"
                  value={users?.length}
                  valueStyle={{
                    color: "#00b5ec",
                    fontSize: "45px",
                  }}
                />
              </Link>
            </Card>
          </Col>
          <Col span={6}>
            <Card bordered={false}>
              <Link
                className="ant-card-body-link"
                to={END_POINT_DASHBOARD_DCTS}
              >
                <Statistic
                  title="Candidats"
                  value={candidates?.length}
                  valueStyle={{
                    color: "#183242",
                    fontSize: "45px",
                  }}
                />
              </Link>
            </Card>
          </Col>
          <Col span={6}>
            <Card bordered={false}>
              <Link
                className="ant-card-body-link"
                to={`${END_POINT_DASHBOARD_DCTS}/completed=true`}
              >
                <Statistic
                  title="DCTs completed"
                  value={dctsOk?.length}
                  valueStyle={{
                    color: "#3f8600",
                    fontSize: "45px",
                  }}
                />
              </Link>
            </Card>
          </Col>
          <Col span={6}>
            <Card bordered={false}>
              <Link
                className="ant-card-body-link"
                to={`${END_POINT_DASHBOARD_DCTS}/completed=false`}
              >
                <Statistic
                  title="DCTs in progress"
                  value={dctsKo?.length}
                  valueStyle={{
                    color: "#cf1322",
                    fontSize: "45px",
                  }}
                />
              </Link>
            </Card>
          </Col>
        </Row>
        <div className="row mt-5">
          <div className="col-md-8">
            <WidgetBarScreen sectors={sectors} dcts={dcts} />
          </div>
          <div className="col-md-4">
            <WidgetDoughnutScreen sectors={sectors} dcts={dcts} />
          </div>
        </div>
        <div className="row mt-5">
          {!!expertises?.length && (
            <>
              <div className="col-md-4">
                <WidgetPieScreen
                  dcts={dcts}
                  expertises={expertises}
                  unit={"IT"}
                />
              </div>
              <div className="col-md-4">
                <WidgetPieScreen
                  dcts={dcts}
                  expertises={expertises}
                  unit={"ME"}
                />
              </div>
              <div className="col-md-4">
                <WidgetPieScreen
                  dcts={dcts}
                  expertises={expertises}
                  unit={"ES"}
                />
              </div>
            </>
          )}
        </div>
        <div className="row">
          <div className="col">
            <Button
              onClick={() => navigate(END_POINT_DASHBOARD_DCTS)}
              type="primary"
              size="large"
              className="float-right dct-talents-pulse-btn-outline-secondary"
            >
              Allez sur les Dcts <ArrowRightOutlined />
            </Button>
            <Title level={2} className="text-left dct-talents-pulse-secondary">
              Les 5 derniers candidats
            </Title>
            <Divider className="dct-talents-pulse-background-sliver" />
            <Table columns={columns} dataSource={dctsTable} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardUserScreen;
