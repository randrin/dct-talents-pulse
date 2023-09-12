import React, { useEffect, useState } from "react";
import StepsDctScreen from "../../dct/StepsDctScreen";
import { ACTION_EDIT } from "../../../../utils/constants";
import { useParams } from "react-router-dom";
import { talentsPulseGetToken } from "../../../../utils";
import { getDctById } from "../../../../services/dctService";
import { Spin, notification } from "antd";

const EditDctScreen = () => {
  // States
  const [api, contextHolder] = notification.useNotification();
  const [dct, setDct] = useState({});
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const dctId = params._id.split("=")[1];

  // Init
  useEffect(() => {
    if (dctId) {
      findDct(dctId);
    }
  }, []);

  // Functions
  const findDct = async (id) => {
    setLoading(true);
    await getDctById(id, talentsPulseGetToken())
      .then((res) => {
        setDct({...res.data.dct, dctId});
      })
      .catch((error) => {
        console.log("EditDctScreen -> findDct Error: ", error.response);
        api.error({
          message: "Erreur",
          description: error.response.data.message || error.response.data.error,
          placement: "topRight",
        });
      });
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleOnCancelStep = () => {
    findDct(dctId);
  };

  // Render
  return (
    <Spin spinning={loading} size="large" tip="Loading">
      {contextHolder}
      <StepsDctScreen
        userDct={dct}
        mode={ACTION_EDIT}
        handleOnCancelStepDct={handleOnCancelStep}
      />
    </Spin>
  );
};

export default EditDctScreen;
