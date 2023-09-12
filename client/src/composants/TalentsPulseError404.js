import React from "react";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import { END_POINT_DASHBOARD, END_POINT_HOME } from "../routers/end-points";
import { LeftOutlined } from "@ant-design/icons";
import { talentsPulseGetToken, talentsPulseGetUser } from "../utils";

const TalentsPulseError404 = () => {
  // States
  const navigate = useNavigate();

  // Functions
  const handleOnNavigate = () => {
    if (talentsPulseGetToken() && talentsPulseGetUser()) {
      navigate(END_POINT_DASHBOARD);
    } else {
      navigate(END_POINT_HOME);
    }
  };

  // Render
  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Button type="primary" onClick={handleOnNavigate}>
          <LeftOutlined />
          Back Home
        </Button>
      }
    />
  );
};

export default TalentsPulseError404;
