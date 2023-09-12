import React, { useEffect, useState } from "react";
import { END_POINT_LOGIN } from "../../routers/end-points";
import { useNavigate } from "react-router-dom";
import { talentsPulseGetToken, talentsPulseGetUser } from "../../utils";
import { ROLE_ADMIN, ROLE_CANDIDATE, ROLE_MEMBER } from "../../utils/constants";
import DashboardCandidateScreen from "./candidate/DashboardCandidateScreen";
import DashboardUserScreen from "./user/DashboardUserScreen";

const DashboardScreen = () => {
  // States
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
  });
  const navigate = useNavigate();

  // Destructing
  const { role } = user;

  // Init
  useEffect(() => {
    let token = talentsPulseGetToken();
    setUser(talentsPulseGetUser());
    if (!token) navigate(END_POINT_LOGIN);
  }, []);

  // Functions

  // Render
  return (
    <div className="dct-dashboard-wrapper">
      {role === ROLE_CANDIDATE && <DashboardCandidateScreen />}
      {(role === ROLE_ADMIN || role === ROLE_MEMBER) && <DashboardUserScreen />}
    </div>
  );
};
export default DashboardScreen;
