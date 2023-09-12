import {
  BarsOutlined,
  BookOutlined,
  CarryOutOutlined,
  DashboardOutlined,
  FileWordOutlined,
  GlobalOutlined,
  ProjectOutlined,
  SolutionOutlined,
  ToolOutlined,
  TeamOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import {
  END_POINT_DASHBOARD,
  END_POINT_DASHBOARD_CANDIDATE_ABOUT,
  END_POINT_DASHBOARD_CANDIDATE_DETAILED_PROJECTS,
  END_POINT_DASHBOARD_CANDIDATE_FORMATIONS,
  END_POINT_DASHBOARD_CANDIDATE_LINGUISTICS,
  END_POINT_DASHBOARD_CANDIDATE_PROJECTS,
  END_POINT_DASHBOARD_CANDIDATE_SKILLS,
  END_POINT_DASHBOARD_CANDIDATE_TECHNICAL_ACHIEVEMENTS,
  END_POINT_DASHBOARD_DCTS,
  END_POINT_DASHBOARD_EXPERTISES,
  END_POINT_DASHBOARD_SECTORS,
  END_POINT_DASHBOARD_USERS,
  END_POINT_MY_DCT,
} from "../routers/end-points";
import { Link } from "react-router-dom";

export const TALENTS_PULSE_NAVBAR_MEMBER = [
  {
    key: "1",
    icon: <DashboardOutlined />,
    label: (
      <Link
        className="dct-talents-pulse-not-text-underline dct-talents-pulse-white"
        to={END_POINT_DASHBOARD}
      >
        Dashboard
      </Link>
    ),
  },
  {
    key: "2",
    icon: <TeamOutlined />,
    label: (
      <Link
        className="dct-talents-pulse-not-text-underline dct-talents-pulse-white"
        to={END_POINT_DASHBOARD_USERS}
      >
        Utilisateurs
      </Link>
    ),
  },
  {
    key: "3",
    icon: <ProjectOutlined />,
    label: (
      <Link
        className="dct-talents-pulse-not-text-underline dct-talents-pulse-white"
        to={END_POINT_DASHBOARD_SECTORS}
      >
        Pôles
      </Link>
    ),
  },
  {
    key: "4",
    icon: <WalletOutlined  />,
    label: (
      <Link
        className="dct-talents-pulse-not-text-underline dct-talents-pulse-white"
        to={END_POINT_DASHBOARD_EXPERTISES}
      >
        Métiers par pôle
      </Link>
    ),
  },
  {
    key: "5",
    icon: <FileWordOutlined  />,
    label: (
      <Link
        className="dct-talents-pulse-not-text-underline dct-talents-pulse-white"
        to={END_POINT_DASHBOARD_DCTS}
      >
        DCT Candidats
      </Link>
    ),
  },
];

export const TALENTS_PULSE_NAVBAR_CANDIDATE = [
  {
    key: "1",
    icon: <DashboardOutlined />,
    label: (
      <Link
        className="dct-talents-pulse-not-text-underline dct-talents-pulse-white"
        to={END_POINT_MY_DCT}
      >
        Mon Dct
      </Link>
    ),
  },
  {
    key: "2",
    icon: <SolutionOutlined />,
    label: (
      <Link
        className="dct-talents-pulse-not-text-underline dct-talents-pulse-white"
        to={END_POINT_DASHBOARD_CANDIDATE_ABOUT}
      >
        A' Propos de moi
      </Link>
    ),
  },
  {
    key: "3",
    icon: <FileWordOutlined />,
    label: (
      <Link
        className="dct-talents-pulse-not-text-underline dct-talents-pulse-white"
        to={END_POINT_DASHBOARD_CANDIDATE_SKILLS}
      >
        Mes Compétences
      </Link>
    ),
  },
  // {
  //   key: "4",
  //   icon: <CarryOutOutlined />,
  //   label: (
  //     <Link
  //       className="dct-talents-pulse-not-text-underline dct-talents-pulse-white"
  //       to={END_POINT_DASHBOARD_CANDIDATE_PROJECTS}
  //     >
  //       Principaux projets
  //     </Link>
  //   ),
  // },
  {
    key: "4",
    icon: <BarsOutlined />,
    label: (
      <Link
        className="dct-talents-pulse-not-text-underline dct-talents-pulse-white"
        to={END_POINT_DASHBOARD_CANDIDATE_DETAILED_PROJECTS}
      >
        Mes Projets Effectués
      </Link>
    ),
  },
  {
    key: "5",
    icon: <BookOutlined />,
    label: (
      <Link
        className="dct-talents-pulse-not-text-underline dct-talents-pulse-white"
        to={END_POINT_DASHBOARD_CANDIDATE_FORMATIONS}
      >
        Mes Formations et Diplômes
      </Link>
    ),
  },
  // {
  //   key: "6",
  //   icon: <ToolOutlined />,
  //   label: (
  //     <Link
  //       className="dct-talents-pulse-not-text-underline dct-talents-pulse-white"
  //       to={END_POINT_DASHBOARD_CANDIDATE_TECHNICAL_ACHIEVEMENTS}
  //     >
  //       Acquis Techniques
  //     </Link>
  //   ),
  // },
  {
    key: "6",
    icon: <GlobalOutlined />,
    label: (
      <Link
        className="dct-talents-pulse-not-text-underline dct-talents-pulse-white"
        to={END_POINT_DASHBOARD_CANDIDATE_LINGUISTICS}
      >
        Mes Acquis Linguistiques
      </Link>
    ),
  },
];

export const TALENTS_PULSE_NAVBAR_CUSTOMER = [
  {
    key: "1",
    icon: <DashboardOutlined />,
    label: (
      <Link
        className="dct-talents-pulse-not-text-underline dct-talents-pulse-white"
        to={END_POINT_DASHBOARD}
      >
        Dashboard
      </Link>
    ),
  },
];
