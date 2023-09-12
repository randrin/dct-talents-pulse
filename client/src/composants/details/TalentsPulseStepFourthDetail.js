import { Divider, Typography } from "antd";
import React from "react";

const TalentsPulseStepFourthDetail = ({ project }) => {
  // Destructing
  const { Paragraph } = Typography;
  const {
    startDate,
    endDate,
    position,
    customer,
    projectTitle,
    achievements,
    technicalEnvironment,
  } = project;

  // Render
  return (
    <div className="talents-pulse-step-projects-detail-accordion-wrapper talents-pulse-standard-title">
      <div className="row talents-pulse-step-projects-detail-accordion-top">
        <div className="col-md-3 font-weight-bold">
          {startDate.split("/")[0] + "/" + startDate.split("/")[1]}
          <span className="m-2">-</span>
          {endDate.split("/")[0] + "/" + endDate.split("/")[1]}
        </div>
        <div className="col-md-6 font-weight-bold text-center">{position}</div>
        <div className="col-md-3 font-weight-bold text-right">{customer}</div>
      </div>
      <Divider className="dct-divider-horizontal" />
      {!!projectTitle?.length && (
        <div className="row talents-pulse-step-projects-detail-accordion-top">
          <div className="col d-grid">
            <Paragraph className="talents-pulse-standard-title font-weight-bold dct-talents-pulse-typography">
              Intitulé du projet
            </Paragraph>
            <Paragraph className="talents-pulse-standard-title">
              ● <span className="ml-2 font-weight-bold">Projet :</span> {projectTitle}
            </Paragraph>
          </div>
        </div>
      )}
      <div className="row talents-pulse-step-projects-detail-accordion-top">
        <div className="col-md-12 font-weight-bold d-grid">
          <Paragraph className="talents-pulse-standard-title dct-talents-pulse-typography">
            Réalisations effectuées :
          </Paragraph>
        </div>
        <div className="col-md-12 ml-4 talents-pulse-container-standard-title">
          {achievements?.map((achievement, index) => (
            <Paragraph
              key={index}
              className="talents-pulse-standard-title dct-talents-pulse-typography"
            >
              <span className="font-weight-bold mr-2">-</span>{" "}
              {achievement?.title}
            </Paragraph>
          ))}
        </div>
      </div>
      {!!technicalEnvironment?.length && (
        <div className="row talents-pulse-step-projects-detail-accordion-top">
          <div className="col-md-12 d-grid mt-3">
            <Paragraph className="talents-pulse-standard-title">
              <span className="font-weight-bold mr-2 dct-talents-pulse-text-underline">
                Environnement techniques :
              </span>
              {technicalEnvironment
                ?.map((environment, index) => environment)
                ?.join(", ")}
            </Paragraph>
          </div>
        </div>
      )}
    </div>
  );
};

export default TalentsPulseStepFourthDetail;
