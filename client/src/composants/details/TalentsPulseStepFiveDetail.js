import React from "react";
import { EditFilled, DeleteFilled } from "@ant-design/icons";
import TalentsPulseEmptyDataSummary from "../inc/TalentsPulseEmptyDataSummary";

const TalentsPulseStepFiveDetail = ({
  formations,
  handleOnEditStepFive,
  handleOnDeleteStepFive,
  showActions,
}) => {
  return (
    <div className="col-md-12">
      <table className="talents-pulse-table talents-pulse-standard-title">
        <thead>
          <tr>
            <th className="talents-pulse-th">Année d’obtention</th>
            <th className="talents-pulse-th">Diplôme</th>
            <th className="talents-pulse-th">Établissement / Lieu</th>
            {showActions && <th className="talents-pulse-th"></th>}
          </tr>
        </thead>
        <tbody>
          {formations?.map((formation, index) => (
            <tr key={index}>
              <td className="talents-pulse-td font-weight-bold">
                {formation?.yearOfGraduation}
              </td>
              <td className="talents-pulse-td">{formation?.degree}</td>
              <td className="talents-pulse-td">{formation?.establishment}</td>
              {showActions && (
                <td className="talents-pulse-td">
                  <span>
                    <EditFilled
                      className="dct-talents-pulse-primary"
                      onClick={() => handleOnEditStepFive(index)}
                    />
                  </span>{" "}
                  <span className="ml-3">
                    <DeleteFilled
                      className="dct-talents-pulse-tomato"
                      onClick={() => handleOnDeleteStepFive(index)}
                    />
                  </span>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {!formations?.length && <TalentsPulseEmptyDataSummary />}
    </div>
  );
};

export default TalentsPulseStepFiveDetail;
