import React from "react";
import { Helmet } from "react-helmet";

const TalentsPulseHelmet = ({ title, description }) => {
  return (
    <Helmet>
      <title>
        {title || process.env.REACT_APP_NAME} | {process.env.REACT_APP_NAME}
      </title>
      <meta name="description" content={description} />
      <meta name="keywords" content={description} />
    </Helmet>
  );
};

export default TalentsPulseHelmet;