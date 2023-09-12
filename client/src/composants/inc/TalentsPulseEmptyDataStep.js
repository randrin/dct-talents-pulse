import React from "react";
import { Button, Empty } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const TalentsPulseEmptyDataStep = ({
  title,
  description,
  btnTitle,
  handleOnBtnAction,
  showContent,
}) => {
  return (
    <>
      {showContent && (
        <div className="col-md-12 mb-5">
          <Empty
            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
            imageStyle={{ height: 200 }}
            description={
              <>
                <h3 className="dct-talents-pulse-secondary">{title}</h3>
                <span className="h6">{description}</span>
              </>
            }
          >
            <Button
              type="primary"
              size="large"
              className="dct-talents-pulse-btn-secondary"
              onClick={handleOnBtnAction}
            >
              <PlusOutlined />
              {btnTitle}
            </Button>
          </Empty>
        </div>
      )}
    </>
  );
};

export default TalentsPulseEmptyDataStep;
