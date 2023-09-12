import React from "react";
import { EditFilled, DeleteFilled } from "@ant-design/icons";
import TalentsPulseEmptyDataSummary from "../inc/TalentsPulseEmptyDataSummary";

const TalentsPulseStepSevenDetail = ({
  linguistics,
  handleOnEditStepSeven,
  handleOnDeleteStepSeven,
  showActions,
}) => {
  return (
    <div className="col-md-12 mb-2">
      <table className="talents-pulse-table talents-pulse-standard-title">
        <thead>
          <tr>
            <th className="talents-pulse-th">Langage</th>
            <th className="talents-pulse-th">Niveau</th>
            {showActions && <th className="talents-pulse-th"></th>}
          </tr>
        </thead>
        <tbody>
          {linguistics?.map((linguistic, index) => (
            <tr key={index}>
              <td className="talents-pulse-td font-weight-bold">
                {linguistic?.language}
              </td>
              <td className="talents-pulse-td">{linguistic?.level}</td>
              {showActions && (
                <td className="talents-pulse-td">
                  <span>
                    <EditFilled
                      className="dct-talents-pulse-secondary"
                      onClick={() => handleOnEditStepSeven(index)}
                    />
                  </span>{" "}
                  <span className="ml-3">
                    <DeleteFilled
                      className="dct-talents-pulse-tomato"
                      onClick={() => handleOnDeleteStepSeven(index)}
                    />
                  </span>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {!linguistics?.length && <TalentsPulseEmptyDataSummary />}
    </div>
  );
};

export default TalentsPulseStepSevenDetail;
