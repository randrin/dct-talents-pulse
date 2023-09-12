import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  DatePicker,
  Divider,
  Drawer,
  Input,
  Radio,
  Select,
  Space,
  Typography,
} from "antd";
import {
  DATE_PICKER_FORMAT,
  GENDER_FEMALE,
  GENDER_MALE,
} from "../../utils/constants";
import dayjs from "dayjs";
import {
  MobileOutlined,
  MailOutlined,
  UserOutlined,
  LeftOutlined,
  CheckCircleOutlined,
  FieldNumberOutlined,
  AlignLeftOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { getListCountriesFlags } from "../../services/utilService";
import moment from "moment";

const ProfileUpdateScreen = ({
  user,
  openDrawer,
  handleOnCloseDrawer,
  handleOnUpdateMember,
}) => {
  // States
  const [countries, setCountries] = useState([]);
  const [userToUpdate, setUserToUpdate] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    email: "",
    role: "",
    country: "",
    dateOfBorn: "",
    phoneNumber: "",
    address: {
      city: "",
      zip: "",
      lineOne: "",
    },
  });

  // Init
  useEffect(() => {
    setUserToUpdate(user);
    listCountriesFlags();
  }, [user]);

  // Destructing
  const { Option } = Select;
  const { Title } = Typography;
  const {
    firstName,
    lastName,
    email,
    role,
    dateOfBorn,
    gender,
    country,
    phoneNumber,
    address,
  } = userToUpdate;

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
      !!address?.zip?.length &&
      !!address?.lineOne?.length &&
      !!address?.city?.length &&
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
      title={"Modification des informations"}
      placement="right"
      open={openDrawer}
      width={720}
      onClose={handleOnCloseDrawer}
      footer={
        <Space>
          <Button type="primary" danger onClick={handleOnCloseDrawer}>
            <LeftOutlined /> Retour
          </Button>
          <Button
            type="primary"
            onClick={() => handleOnUpdateMember(userToUpdate)}
            disabled={handleOnValidate()}
          >
            <CheckCircleOutlined />
            Modifier
          </Button>
        </Space>
      }
    >
      <div className="container-fluid">
        <Title level={2}>Informations Personnelles</Title>
        <Divider className="dct-talents-pulse-background-sliver dct-talents-pulse-without-margin" />
        <div className="row mt-3 mb-2">
          <div className="col-md-6 mb-3">
            <label htmlFor="gender">
              Civilité <span className="dct-talents-pulse-field-required">*</span>
            </label>
            <br />
            <Radio.Group
              name="gender"
              defaultValue={GENDER_MALE}
              value={gender}
              onChange={(e) =>
                setUserToUpdate({ ...userToUpdate, gender: e.target.value })
              }
            >
              <Radio value={GENDER_MALE}>Monsieur</Radio>
              <Radio value={GENDER_FEMALE}>Madame</Radio>
            </Radio.Group>
          </div>
        </div>
        <div className="row mb-2">
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
              onChange={(e) =>
                setUserToUpdate({ ...userToUpdate, firstName: e.target.value })
              }
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
              onChange={(e) =>
                setUserToUpdate({ ...userToUpdate, lastName: e.target.value })
              }
            />
          </div>
        </div>
        <div className="row mb-2">
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
              onChange={(e) =>
                setUserToUpdate({ ...userToUpdate, email: e.target.value })
              }
            />
          </div>
        </div>
        <div className="row mb-2">
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
              disabledDate={(current) =>
                current && current.valueOf() > moment().subtract(18, "year")
              }
              defaultValue={dayjs(dateOfBorn, DATE_PICKER_FORMAT.replaceAll("/", "-"))}
              onChange={(date, dateString) =>
                setUserToUpdate({ ...userToUpdate, dateOfBorn: dateString })
              }
            />
          </div>
        </div>
        <Title level={2}>Addresse & Contact</Title>
        <Divider className="dct-talents-pulse-background-sliver dct-talents-pulse-without-margin" />
        <div className="row mt-4 mb-2">
          <div className="col-md-4 mb-3">
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
              onChange={(e) => setUserToUpdate({ ...userToUpdate, country: e })}
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
          <div className="col-md-4 mb-3">
            <label htmlFor="zip">
              Code Postal <span className="dct-talents-pulse-field-required">*</span>
            </label>
            <Input
              name="zip"
              size="large"
              prefix={<FieldNumberOutlined />}
              type="number"
              placeholder="Code postal"
              value={address?.zip}
              onChange={(e) =>
                setUserToUpdate({
                  ...userToUpdate,
                  address: {
                    ...address,
                    zip: e.target.value,
                  },
                })
              }
            />
          </div>
          <div className="col-md-4 mb-3">
            <label htmlFor="city">
              Ville/État <span className="dct-talents-pulse-field-required">*</span>
            </label>
            <Input
              name="city"
              size="large"
              prefix={<AlignLeftOutlined />}
              type="text"
              placeholder="votre ville"
              value={address?.city}
              onChange={(e) =>
                setUserToUpdate({
                  ...userToUpdate,
                  address: {
                    ...address,
                    city: e.target.value,
                  },
                })
              }
            />
          </div>
        </div>
        <div className="row mb-2">
          <div className="col mb-3">
            <label htmlFor="lineOne">
              Rue <span className="dct-talents-pulse-field-required">*</span>
            </label>
            <Input
              name="lineOne"
              size="large"
              prefix={<HomeOutlined />}
              type="text"
              placeholder="votre addresse compléte"
              value={address?.lineOne}
              onChange={(e) =>
                setUserToUpdate({
                  ...userToUpdate,
                  address: {
                    ...address,
                    lineOne: e.target.value,
                  },
                })
              }
            />
          </div>
        </div>
        <div className="row mb-2">
          <div className="col-md-6 mb-3">
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
                setUserToUpdate({
                  ...userToUpdate,
                  phoneNumber: e.target.value,
                })
              }
            />
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default ProfileUpdateScreen;
