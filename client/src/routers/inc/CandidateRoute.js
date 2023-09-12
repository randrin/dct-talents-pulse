import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { END_POINT_DASHBOARD, END_POINT_LOGIN } from "../end-points";
import { ROLE_CANDIDATE } from "../../utils/constants";
import { talentsPulseGetToken, talentsPulseRemoveToken } from "../../utils";
import { userByToken } from "../../services/userService";

const CandidateRoute = ({ children }) => {
  // States
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  // Init
  useEffect(() => {
    findUserByToken();
  }, []);

  // Destructing
  const { role } = user;

  // Functions
  const findUserByToken = async () => {
    await userByToken(talentsPulseGetToken())
      .then((res) => {
        setUser(res.data.user);
      })
      .catch((error) => {
        console.log("CandidateRoute -> userByToken error: ", error);
        setTimeout(() => {
          talentsPulseRemoveToken();
          navigate(END_POINT_LOGIN);
        }, 2000);
      });
  };

  // Render
  if (user && role === ROLE_CANDIDATE) {
    return children;
  }
  return navigate(END_POINT_DASHBOARD);
};

export default CandidateRoute;
