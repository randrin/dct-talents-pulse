import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  StopOutlined,
  TeamOutlined,
  UserOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import {
  LOCAL_STORAGE_AUTH,
  ROLE_ADMIN,
  ROLE_CANDIDATE,
  ROLE_MEMBER,
  STATUS_ACTIVE,
  STATUS_DISABLED,
  STATUS_PENDING,
  STATUS_SUSPENDED,
} from "./constants";

export const talentsPulseGetStatusColor = (status) => {
  switch (status) {
    case STATUS_ACTIVE:
      return "#2a7a39";
    case STATUS_PENDING:
      return "#ffc107";
    case STATUS_DISABLED:
    case STATUS_SUSPENDED:
      return "#f55854";
    case ROLE_MEMBER:
      return "#183242";
    case ROLE_ADMIN:
      return "#00b5ec";
    default:
      return "#63666a";
  }
};

export const talentsPulseGetRoleIcon = (status) => {
  switch (status) {
    case ROLE_CANDIDATE:
      return <UserOutlined />;
    case ROLE_MEMBER:
      return <UserSwitchOutlined />;
    case ROLE_ADMIN:
      return <TeamOutlined />;
    case STATUS_ACTIVE:
      return <CheckCircleOutlined />;
    case STATUS_PENDING:
      return <ClockCircleOutlined />;
    case STATUS_DISABLED:
      return <CloseCircleOutlined />;
    case STATUS_SUSPENDED:
      return <StopOutlined />;
    default:
      return <UserOutlined />;
  }
};

export const talentsPulseCalculDiffDate = (date) => {
  let start = new Date().getTime();
  let end = new Date(date).getTime();
  let time = start - end;
  let diffDay = Math.floor(time / 86400000);
  let diffHour = Math.floor((time % 86400000) / 3600000);
  let diffMinute = Math.floor(((time % 86400000) % 3600000) / 60000);
  let diffSecond = "Now";

  if (diffDay >= 1) {
    let oneormany = "";
    if (diffDay !== 1) {
      oneormany = "s";
    }
    let txt = "day" + oneormany + " ago";
    //let txtnb = Number(txt);
    return diffDay + " " + txt;
  } else if (diffHour >= 1 && diffHour < 24) {
    let oneormany = "";
    if (diffHour !== 1) {
      oneormany = "s";
    }
    let txt = "hour" + oneormany + " ago";
    //let txtnb = Number(txt);
    return diffHour + " " + txt;
  } else if (diffMinute >= 1 && diffMinute < 60) {
    let oneormany = "";
    if (diffMinute !== 1) {
      oneormany = "s";
    }
    let txt = "minute" + oneormany + " ago";
    //let txtnb = Number(txt);
    return diffMinute + " " + txt;
  } else {
    return diffSecond;
  }
};

export const talentsPulseExtractDateToMonth = (date) => {
  switch (date) {
    case "01":
      return "Janvier";
    case "02":
      return "Février";
    case "03":
      return "Mars";
    case "04":
      return "Avril";
    case "05":
      return "Mai";
    case "06":
      return "Juin";
    case "07":
      return "Juillet";
    case "08":
      return "Août";
    case "09":
      return "Septembre";
    case "10":
      return "Octobre";
    case "11":
      return "Novembre";
    case "12":
      return "Décembre";
    default:
      return "Janvier";
  }
};

export const talentsPulseProgressDct = (dct) => {
  let progress = 0;
  if (!!dct.description?.length) {
    progress += 15;
  }
  if (!!dct.skills?.length) {
    progress += 20;
  }
  if (!!dct.projectsDetail?.length) {
    progress += 30;
  }
  if (!!dct.formations?.length) {
    progress += 20;
  }
  if (!!dct.linguistics?.length) {
    progress += 15;
  }
  return progress;
};

export const isAdmin = () => {
  return talentsPulseGetUser()?.role === ROLE_ADMIN;
};

export const isMember = () => {
  return talentsPulseGetUser()?.role === ROLE_MEMBER;
};

export const isCandidate = () => {
  return talentsPulseGetUser()?.role === ROLE_CANDIDATE;
};

export const talentsPulseRemoveToken = () => {
  localStorage.removeItem(LOCAL_STORAGE_AUTH);
};

export const talentsPulseGetToken = () => {
  if (
    localStorage.getItem(LOCAL_STORAGE_AUTH) &&
    localStorage.getItem(LOCAL_STORAGE_AUTH) !== undefined
  )
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_AUTH))?.token;
  return "";
};

export const talentsPulseGetUser = () => {
  if (
    localStorage.getItem(LOCAL_STORAGE_AUTH) &&
    localStorage.getItem(LOCAL_STORAGE_AUTH) !== undefined
  )
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_AUTH))?.user;
  return {};
};

export const talentsPulseSetUser = (user) => {
  return localStorage.setItem(LOCAL_STORAGE_AUTH, JSON.stringify(user));
};
