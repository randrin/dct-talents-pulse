import React, { useEffect, useState } from "react";
import { LeftOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { Alert, Button, Drawer, Select, Space } from "antd";
import { ROLES, STATUS } from "../../../../utils/constants";

const RoleAndStatusMemberScreen = ({
  user,
  openRoleDrawer,
  handleOnCloseRoleDrawer,
  handleOnSaveRoleMember,
}) => {
  // States
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");

  // Init
  useEffect(() => {
    setRole(user.role);
    setStatus(user.status);
  }, [user]);

  // Destructing
  const { Option } = Select;

  // Render
  return (
    <Drawer
      title="Change de rôle"
      placement="right"
      open={openRoleDrawer}
      onClose={handleOnCloseRoleDrawer}
      footer={
        <Space>
          <Button type="primary" danger onClick={handleOnCloseRoleDrawer}>
            <LeftOutlined /> Retour
          </Button>
          <Button
            type="primary"
            onClick={() => handleOnSaveRoleMember(user, role, status)}
          >
            <CheckCircleOutlined />
            Mettre à jour
          </Button>
        </Space>
      }
    >
      <div className="container">
        <div className="row mb-3">
          <div className="col mb-3">
            <Alert
              message="Informational Notes"
              description="Donnez ou restreintes plus de privilèges à votre effectif."
              type="info"
              showIcon
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col mb-3">
            <label htmlFor="role">
              Rôle <span className="dct-talents-pulse-field-required">*</span>
            </label>
            <Select
              name="role"
              size="large"
              value={role}
              showSearch
              showArrow
              style={{ width: "100%" }}
              placeholder="Selectionez un rôle"
              optionFilterProp="children"
              onChange={(e) => setRole(e)}
              filterOption={(input, option) =>
                option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {ROLES.map((role, index) => (
                <Option key={index} value={role.name}>
                  {role.icon} {role.name}
                </Option>
              ))}
            </Select>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col mb-3">
            <label htmlFor="status">
              Status <span className="dct-talents-pulse-field-required">*</span>
            </label>
            <Select
              name="status"
              size="large"
              value={status}
              showSearch
              showArrow
              style={{ width: "100%" }}
              placeholder="Selectionez un status"
              optionFilterProp="children"
              onChange={(e) => setStatus(e)}
              filterOption={(input, option) =>
                option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {STATUS.map((statut, index) => (
                <Option key={index} value={statut.name}>
                  {statut.icon} {statut.name}
                </Option>
              ))}
            </Select>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default RoleAndStatusMemberScreen;
