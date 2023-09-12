import React from "react";
import { EditFilled, DeleteFilled } from "@ant-design/icons";
import TalentsPulseEmptyDataSummary from "../inc/TalentsPulseEmptyDataSummary";

const TalentsPulseStepSixDetail = ({
  tecnicalSkills,
  handleOnEditStepSix,
  handleOnDeleteStepSix,
  showActions,
}) => {
  return (
    <div className="col-md-12 mb-2">
      <table className="talents-pulse-table talents-pulse-standard-title">
        <thead>
          <tr>
            <th className="talents-pulse-th">Logiciel</th>
            <th className="talents-pulse-th">Niveau</th>
            {showActions && <th className="talents-pulse-th"></th>}
          </tr>
        </thead>
        <tbody>
          {tecnicalSkills?.map((skill, index) => (
            <tr key={index}>
              <td className="talents-pulse-td font-weight-bold">{skill?.software}</td>
              <td className="talents-pulse-td">{skill?.level}</td>
              {showActions && (
                <td className="talents-pulse-td">
                  <span>
                    <EditFilled
                      className="dct-talents-pulse-primary"
                      onClick={() => handleOnEditStepSix(index)}
                    />
                  </span>{" "}
                  <span className="ml-3">
                    <DeleteFilled
                      className="dct-talents-pulse-tomato"
                      onClick={() => handleOnDeleteStepSix(index)}
                    />
                  </span>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {!tecnicalSkills?.length && <TalentsPulseEmptyDataSummary />}
    </div>
  );
};

export default TalentsPulseStepSixDetail;
