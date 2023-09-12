import React from "react";
import { EditFilled, DeleteFilled } from "@ant-design/icons";
import TalentsPulseEmptyDataSummary from "../inc/TalentsPulseEmptyDataSummary";

const TalentsPulseStepTwoDetail = ({
  skills,
  handleOnEditStepTwo,
  handleOnDeleteStepTwo,
  showActions,
}) => {
  return (
    <>
      <div className="col-md-12">
        <div className="row mb-4 talents-pulse-step-header">
          <div className="col-md-8 font-weight-bold talents-pulse-standard-title">
            COMPÉTENCE
          </div>
          <div
            className={`col-md-${
              showActions ? 3 : 4
            } font-weight-bold talents-pulse-standard-title`}
          >
            NIVEAU
          </div>
          {showActions && (
            <div className="col-md-1 font-weight-bold talents-pulse-standard-title"></div>
          )}
        </div>
      </div>
      <div className="col-md-12">
        {!!skills?.length ? (
          skills?.map((element, index) => (
            <div key={index} className="row mb-2">
              <div className="col-md-8 font-weight-bold talents-pulse-step-skill-content">
                <span className="talents-pulse-step-skill-item talents-pulse-standard-title">
                  {element.content}
                </span>
              </div>
              <div className="col-md-3 talents-pulse-step-skill-level talents-pulse-standard-title">
                {element.level}
              </div>
              {showActions && (
                <div className="col-md-1 talents-pulse-step-skill-level talents-pulse-standard-title">
                  <span>
                    <EditFilled
                      className="dct-talents-pulse-secondary"
                      onClick={() => handleOnEditStepTwo(index)}
                    />
                  </span>{" "}
                  <span className="ml-3">
                    <DeleteFilled
                      className="dct-talents-pulse-tomato"
                      onClick={() => handleOnDeleteStepTwo(index)}
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

export default TalentsPulseStepTwoDetail;
