import React, { useEffect, useState } from "react";
import {
  MobileOutlined,
  MailOutlined,
  UserOutlined,
  LeftOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  DatePicker,
  Drawer,
  Input,
  Radio,
  Select,
  Space,
} from "antd";
import { GENDER_FEMALE, GENDER_MALE, ROLES } from "../../../../utils/constants";
import { getListCountriesFlags } from "../../../../services/utilService";

const AddMemberScreen = ({
  openAddDrawer,
  handleOnCloseAddDrawer,
  handleOnSaveMember,
}) => {
  // States
  const [countries, setCountries] = useState([]);
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    email: "",
    role: "",
    country: "",
    dateOfBorn: "",
    phoneNumber: "",
  });

  // Init
  useEffect(() => {
    listCountriesFlags();
  }, []);

  // Destructing
  const { Option } = Select;
  const {
    firstName,
    lastName,
    email,
    role,
    dateOfBorn,
    gender,
    country,
    phoneNumber,
  } = user;

  // Functions
  const listCountriesFlags = async () => {
    getListCountriesFlags()
      .then((res) => {
        if (res.status === 200) {
          setCountries(res?.data?.data);
        }
      })
      .catch((error) => {
        console.log("Register -> listCountriesFlags Error: ", error);
      });
  };

  const handleOnValidate = () => {
    return !!gender?.length &&
      !!email?.length &&
      !!firstName?.length &&
      !!lastName?.length &&
      !!role?.length &&
      !!country?.length &&
      !!phoneNumber?.length &&
      !!dateOfBorn?.length
      ? false
      : true;
  };

  // Render
  return (
    <Drawer
      title={"Ajouter un nouveau membre"}
      placement="right"
      open={openAddDrawer}
      width={720}
      onClose={handleOnCloseAddDrawer}
      footer={
        <Space>
          <Button type="primary" danger onClick={handleOnCloseAddDrawer}>
            <LeftOutlined /> Retour
          </Button>
          <Button
            type="primary"
            onClick={() => handleOnSaveMember(user)}
            disabled={handleOnValidate()}
          >
            <CheckCircleOutlined />
            Ajoutez
          </Button>
        </Space>
      }
    >
      <div className="container-fluid">
        <div className="row mt-4 mb-3">
          <div className="col-md-6 mb-3">
            <label htmlFor="firstName">
              Civilité <span className="dct-talents-pulse-field-required">*</span>
            </label>
            <br />
            <Radio.Group
              name="gender"
              defaultValue={GENDER_MALE}
              value={gender}
              onChange={(e) => setUser({ ...user, gender: e.target.value })}
            >
              <Radio value={GENDER_MALE}>Monsieur</Radio>
              <Radio value={GENDER_FEMALE}>Madame</Radio>
            </Radio.Group>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6 mb-3">
            <label htmlFor="firstName">
              Prénom <span className="dct-talents-pulse-field-required">*</span>
            </label>
            <Input
              name="firstName"
              size="large"
              prefix={<UserOutlined />}
              type="text"
              placeholder="Votre prénom"
              value={firstName}
              onChange={(e) => setUser({ ...user, firstName: e.target.value })}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="lastName">
              Nom <span className="dct-talents-pulse-field-required">*</span>
            </label>
            <Input
              name="lastName"
              size="large"
              prefix={<UserOutlined />}
              type="text"
              placeholder="Votre nom"
              value={lastName}
              onChange={(e) => setUser({ ...user, lastName: e.target.value })}
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col mb-3">
            <label htmlFor="email">
              Courrier électronique
              <span className="dct-talents-pulse-field-required">*</span>
            </label>
            <Input
              name="email"
              size="large"
              prefix={<MailOutlined />}
              type="email"
              placeholder="Votre addresse email"
              value={email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6 mb-3">
            <label htmlFor="dateOfBorn">
              Date de naissance
              <span className="dct-talents-pulse-field-required">*</span>
            </label>
            <DatePicker
              name="dateOfBorn"
              style={{ width: "100%" }}
              placeholder="Selectionez une date"
              size="large"
              onChange={(date, dateString) =>
                setUser({ ...user, dateOfBorn: dateString })
              }
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="country">
              Pays de résidence
              <span className="dct-talents-pulse-field-required">*</span>
            </label>
            <Select
              name="country"
              size="large"
              value={country}
              showSearch
              showArrow
              style={{ width: "100%" }}
              placeholder="Selectionez un pays"
              optionFilterProp="children"
              onChange={(e) => setUser({ ...user, country: e })}
              filterOption={(input, option) =>
                option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {countries.map((ctry, index) => (
                <Option key={index} value={ctry.name}>
                  <Avatar src={ctry.flag} size={20} /> {ctry.name}
                </Option>
              ))}
            </Select>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-4 mb-3">
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
              onChange={(e) => setUser({ ...user, role: e })}
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
          <div className="col-md-8 mb-3">
            <label htmlFor="phoneNumber">
              Numéro de téléphone
              <span className="dct-talents-pulse-field-required">*</span>
            </label>
            <Input
              name="phoneNumber"
              size="large"
              prefix={<MobileOutlined />}
              type="number"
              placeholder="votre contact"
              value={phoneNumber}
              onChange={(e) =>
                setUser({ ...user, phoneNumber: e.target.value })
              }
            />
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default AddMemberScreen;
