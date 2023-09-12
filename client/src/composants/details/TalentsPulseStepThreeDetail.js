import React from "react";
import { EditFilled, DeleteFilled } from "@ant-design/icons";
import TalentsPulseEmptyDataSummary from "../inc/TalentsPulseEmptyDataSummary";

const TalentsPulseStepThreeDetail = ({
  projects,
  handleOnEditStepThree,
  handleOnDeleteStepThree,
  showActions,
}) => {
  return (
    <>
      <div className="col-md-12">
        <div className="row mb-4 talents-pulse-step-header">
          <div className="col-md-4 font-weight-bold talents-pulse-standard-title">
            Principaux projets
          </div>
          <div className="col-md-4 font-weight-bold talents-pulse-standard-title">
            Secteur d’activité
          </div>
          <div className="col-md-3 font-weight-bold talents-pulse-standard-title">
            Client
          </div>
        </div>
      </div>
      <div className="col-md-12">
        {!!projects?.length ? (
          projects?.map((element, index) => (
            <div key={index} className="row mb-2">
              <div className="col-md-4 font-weight-bold talents-pulse-step-project-project">
                <span className="talents-pulse-step-project-item">
                  {element.entitled}
                </span>
              </div>
              <div className="col-md-4 talents-pulse-step-project-sector">
                <span className="talents-pulse-step-project-item">
                  {element.sector}
                </span>
              </div>
              <div className="col-md-3 talents-pulse-step-project-customer">
                <span className="talents-pulse-step-project-item">
                  {element.customer}
                </span>
              </div>
              {showActions && (
                <div className="col-md-1 talents-pulse-step-skill-level talents-pulse-standard-title">
                  <span>
                    <EditFilled
                      className="dct-talents-pulse-primary"
                      onClick={() => handleOnEditStepThree(index)}
                    />
                  </span>{" "}
                  <span className="ml-3">
                    <DeleteFilled
                      className="dct-talents-pulse-tomato"
                      onClick={() => handleOnDeleteStepThree(index)}
                    />
                  </span>
                </div>
              )}
            </div>
          ))
        ) : (
          <TalentsPulseEmptyDataSummary />
        )}
      </div>
    </>
  );
};

export default TalentsPulseStepThreeDetail;
