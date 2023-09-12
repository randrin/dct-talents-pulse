import React, { useEffect } from "react";
import TalentsPulseStepFiveDetail from "../details/TalentsPulseStepFiveDetail";
import TalentsPulseStepFourthDetail from "../details/TalentsPulseStepFourthDetail";
import TalentsPulseStepSevenDetail from "../details/TalentsPulseStepSevenDetail";
import TalentsPulseStepTwoDetail from "../details/TalentsPulseStepTwoDetail";
import TalentsPulseNextPreviousStep from "./TalentsPulseNextPreviousStep";
import {
  Collapse,
  Divider,
  Typography,
} from "antd";
import TalentsPulseEmptyDataSummary from "./TalentsPulseEmptyDataSummary";

const TalentsPulseStepSummary = ({
  dct,
  steps,
  current,
  handleOnPrevious,
  title,
  showSteps,
}) => {
  // States

  // Init
  useEffect(() => {}, []);

  // Destructing
  const { Panel } = Collapse;
  const { Title, Paragraph } = Typography;

  // Functions
  const onChange = (key) => {
    console.log(key);
  };

  // Render
  return (
    <div className="talents-pulse-step-summary-wrapper">
      {title && (
        <Title
          level={1}
          className="dct-talents-pulse-secondary text-left talents-pulse-step-title"
        >
          {title}
        </Title>
      )}
      <div className="row mt-5 talents-pulse-step-summary-container">
        <div className="col-md-12 text-center mb-5">
          <Paragraph className="talents-pulse-step-summary-user">
            {dct?.user?.firstName} {dct?.user?.lastName}
          </Paragraph>
          <Paragraph className="talents-pulse-step-summary-profession">
            {dct?.expertise?.name}
          </Paragraph>
          <Paragraph className="talents-pulse-step-summary-experience-year">
            {dct?.expNumber} ans d'expériences
          </Paragraph>
        </div>
        <div className="col-md-12 font-weight-bold talents-pulse-standard-title talents-pulse-step-summary-header">
          MOTIVATION
        </div>
        {dct?.description ? (
          <span className="mt-4 mb-4 mb-3 col-md-12 text-center talents-pulse-standard-title">
            {dct?.description}
          </span>
        ) : (
          <TalentsPulseEmptyDataSummary />
        )}
      </div>
      <div className="row mt-4 talents-pulse-step-summary-container">
        <TalentsPulseStepTwoDetail skills={dct?.skills} />
      </div>
      {/* <div className="row mt-4 talents-pulse-step-summary-container">
        <TalentsPulseStepThreeDetail projects={dct?.projects} />
      </div> */}
      <div className="row mt-4 talents-pulse-step-summary-container">
        <div className="col-md-12">
          <div className="row mb-4 talents-pulse-step-header">
            <div className="col-md-12 font-weight-bold text-center talents-pulse-standard-title">
              EXPÉRIENCES
            </div>
          </div>
          <div className="row mb-4">
            {!!dct?.projectsDetail?.length ? (
              dct?.projectsDetail?.map((project, index) => (
                <div
                  className={`col-md-12 ${
                    dct?.projectsDetail?.length - 1 !== index ? "mb-2" : ""
                  }`}
                  key={index}
                >
                  <Collapse defaultActiveKey={[index]} onChange={onChange}>
                    <Panel
                      header={`${
                        project?.startDate.split("/")[0] +
                        "/" +
                        project?.startDate.split("/")[1]
                      } - ${
                        project?.endDate.split("/")[0] +
                        "/" +
                        project?.endDate.split("/")[1]
                      } : ${project?.position} - ${project?.customer}`}
                      key={index}
                      className="talents-pulse-standard-title"
                    >
                      <TalentsPulseStepFourthDetail project={project} />
                    </Panel>
                  </Collapse>
                </div>
              ))
            ) : (
              <TalentsPulseEmptyDataSummary />
            )}
          </div>
        </div>
      </div>
      <div className="row mt-4 talents-pulse-step-summary-container">
        <div className="col-md-12">
          <div className="row mb-4 text-center talents-pulse-step-header">
            <div className="col-md-12 font-weight-bold talents-pulse-standard-title">
              INFORMATIONS ET DIPLÔMES
            </div>
          </div>
        </div>
        <TalentsPulseStepFiveDetail formations={dct?.formations} />
      </div>
      <div className="row mt-4 talents-pulse-step-summary-container">
        <div className="col-md-12">
          <div className="row mb-4 talents-pulse-step-header">
            <div className="col-md-4 font-weight-bold talents-pulse-standard-title">
              ACQUIS LINGUISTIQUES
            </div>
          </div>
        </div>
        {/* <TalentsPulseStepSixDetail tecnicalSkills={dct?.tecnicalSkills} /> */}
        <TalentsPulseStepSevenDetail linguistics={dct?.linguistics} />
      </div>
      {showSteps && (
        <>
          <Divider className="dct-talents-pulse-background-sliver" />
          <TalentsPulseNextPreviousStep
            dct={dct}
            steps={steps}
            current={current}
            handleOnPrevious={handleOnPrevious}
          />
        </>
      )}
    </div>
  );
};

export default TalentsPulseStepSummary;
