import React, { useEffect, useState } from "react";
import DashboardLayout from "../dashboard/DashboardLayout";
import {
  Avatar,
  Divider,
  Space,
  Typography,
  Input,
  Radio,
  Select,
  Button,
  notification,
  Tag,
  Tooltip,
  Badge,
} from "antd";
import Resizer from "react-image-file-resizer";
import {
  MailFilled,
  PhoneFilled,
  SmileOutlined,
  UserAddOutlined,
  UserOutlined,
  HomeOutlined,
  FieldNumberOutlined,
  AlignLeftOutlined,
  EditFilled,
  LockFilled,
  CloudUploadOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  talentsPulseConvertToCapitalize,
  talentsPulseGetRoleIcon,
  talentsPulseGetStatusColor,
  talentsPulseGetToken,
  talentsPulseGetUser,
  talentsPulseSetUser,
} from "../../utils";
import {
  getListCountriesFlags,
  removeImage,
  uploadImages,
} from "../../services/utilService";
import moment from "moment";
import {
  FORMAT_BASE_64,
  FORMAT_DATE,
  FORMAT_JPEG,
  GENDER_FEMALE,
  GENDER_MALE,
} from "../../utils/constants";
import ProfileUpdateScreen from "./ProfileUpdateScreen";
import { userUpdate, userUpdateAvatar } from "../../services/userService";
import { END_POINT_DASHBOARD_CHANGE_PASSWORD } from "../../routers/end-points";

const ProfileScreen = () => {
  // States
  const [api, contextHolder] = notification.useNotification();
  const [countries, setCountries] = useState([]);
  const [user, setUser] = useState({});
  const [openDrawer, setOpenDrawer] = useState(false);
  const navigate = useNavigate();

  // Init
  useEffect(() => {
    setUser(talentsPulseGetUser());
    listCountriesFlags();
  }, []);

  // Destructing
  const { Option } = Select;
  const { Title } = Typography;
  const {
    firstName,
    lastName,
    pseudo,
    gender,
    email,
    country,
    role,
    phoneNumber,
    createdAt,
    dateOfBorn,
    address,
    photoURL,
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
        console.log("ProfileScreen -> listCountriesFlags Error: ", error);
      });
  };

  const handleOnUpdateProfile = () => {
    setOpenDrawer(!openDrawer);
  };

  const handleOnUpdateMember = async (user) => {
    await userUpdate(user, talentsPulseGetToken())
      .then((res) => {
        api.success({
          message: "Succés",
          description: res.data.message,
          placement: "topRight",
        });
        talentsPulseSetUser(res.data);
        handleOnUpdateProfile();
        window.location.reload();
      })
      .catch((error) => {
        console.log(
          "ProfileScreen -> handleOnUpdateMember Error: ",
          error.response
        );
        api.error({
          message: "Erreur",
          description: error.response.data.message || error.response.data.error,
          placement: "topRight",
        });
      });
  };

  const handleImageChange = async (e) => {
    // Resize
    const files = e.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        Resizer.imageFileResizer(
          files[i],
          720,
          720,
          FORMAT_JPEG,
          100,
          0,
          (uri) => {
            uploadImages(uri, talentsPulseGetToken())
              .then((res) => {
                console.log("res: ", res);
                handleOnUserUpdate(res);
              })
              .catch((error) => {
                console.log(
                  "ProfileScreen -> handleImageChange Error: ",
                  error.response
                );
                api.error({
                  message: "Erreur",
                  description:
                    error.response.data.message || error.response.data.error,
                  placement: "topRight",
                });
              });
          },
          FORMAT_BASE_64
        );
      }
    }
  };

  const handleOnUserUpdate = async (data) => {
    await userUpdateAvatar(user, data, talentsPulseGetToken())
      .then((res) => {
        api.success({
          message: "Succés",
          description: res.data.message,
          placement: "topRight",
        });
        let user = {
          user: res.data?.user,
          token: talentsPulseGetToken(),
        };
        talentsPulseSetUser(user);
        window.location.reload();
      })
      .catch((error) => {
        console.log(
          "ProfileScreen -> handleOnUserUpdate Error: ",
          error.response
        );
        api.error({
          message: "Erreur",
          description: error.response.data.message || error.response.data.error,
          placement: "topRight",
        });
      });
  };

  const handleImageRemove = async (public_id) => {
    await removeImage(public_id, talentsPulseGetToken())
      .then((res) => {
        handleOnUserUpdate(res);
      })
      .catch((error) => {
        console.log(
          "ProfileScreen -> handleImageRemove Error: ",
          error.response
        );
        api.error({
          message: "Erreur",
          description: error.response.data.message || error.response.data.error,
          placement: "topRight",
        });
      });
  };

  // Render
  return (
    <DashboardLayout>
      {contextHolder}
      <div className="container-fluid">
        <Title level={2}>Mon Profil</Title>
        <Divider className="dct-talents-pulse-background-sliver dct-talents-pulse-without-margin" />
        <div className="row mt-5 mb-5">
          <div className="col-md-2">
            <Space direction="vertical" size={16}>
              <Space wrap size={16}>
                {!!photoURL?.public_id?.length ? (
                  <div className="dct-talents-pulse-profile-img">
                    <Badge
                      count="X"
                      key={photoURL?.public_id}
                      onClick={() => handleImageRemove(photoURL?.public_id)}
                      className="dct-icon-remove-img"
                    >
                      <Avatar
                        key={photoURL?.public_id}
                        src={photoURL?.url}
                        size={100}
                        shape="square"
                        className="m-3"
                      />
                    </Badge>
                    <Tooltip title="Modifier la photo de profil">
                      <label className="dct-talents-pulse-btn-upload">
                        <EditFilled className="ant-btn ant-btn-circle" />
                        <input
                          className="ant-upload-drag-icon"
                          type="file"
                          multiple
                          name="image"
                          hidden
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                    </Tooltip>
                  </div>
                ) : (
                  <div className="dct-talents-pulse-profile-img">
                    <Avatar
                      shape="square"
                      className="dct-talents-pulse-background-primary dct-talents-pulse-white"
                      size={100}
                    >
                      <b>
                        {firstName?.charAt(0).toUpperCase()}
                        {lastName?.charAt(0).toUpperCase()}
                      </b>
                    </Avatar>
                    <Tooltip title="Ajouter une photo de profil">
                      <label className="dct-talents-pulse-btn-upload">
                        <CloudUploadOutlined className="ant-btn-circle" />
                        <input
                          className="ant-upload-drag-icon"
                          type="file"
                          multiple
                          name="image"
                          hidden
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                    </Tooltip>
                  </div>
                )}
              </Space>
            </Space>
          </div>
          <div className="col-md-10">
            <div className="row mt-4">
              <div className="col-md-3">
                <label htmlFor="gender" className="dct-talents-pulse-font-bold">
                  Civilité
                </label>
                <br />
                <Radio.Group name="gender" disabled value={gender}>
                  <Radio value={GENDER_MALE}>Monsieur</Radio>
                  <Radio value={GENDER_FEMALE}>Madame</Radio>
                </Radio.Group>
              </div>
              <div className="col-md-3">
                <label htmlFor="role" className="dct-talents-pulse-font-bold">
                  Vous êtes
                </label>
                <br />
                <Tag
                  icon={talentsPulseGetRoleIcon(role)}
                  color={talentsPulseGetStatusColor(role)}
                >
                  {role}
                </Tag>
              </div>
              <div className="col-md-3">
                <label
                  htmlFor="createdAt"
                  className="dct-talents-pulse-font-bold"
                >
                  Date de Naissance
                </label>
                <br />
                <span>{moment(dateOfBorn).format(FORMAT_DATE)}</span>
              </div>
              <div className="col-md-3">
                <label
                  htmlFor="createdAt"
                  className="dct-talents-pulse-font-bold"
                >
                  Membre depuis
                </label>
                <br />
                <span>{moment(createdAt, "YYYYMMDD").fromNow()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-md-4">
            <label htmlFor="firstName" className="dct-talents-pulse-font-bold">
              Prénom
            </label>
            <Input
              value={talentsPulseConvertToCapitalize(firstName)}
              name="firstName"
              size="large"
              prefix={<UserOutlined />}
              disabled
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="lastName" className="dct-talents-pulse-font-bold">
              Nom
            </label>
            <Input
              value={talentsPulseConvertToCapitalize(lastName)}
              name="lastName"
              size="large"
              prefix={<UserOutlined />}
              disabled
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="pseudo" className="dct-talents-pulse-font-bold">
              Pseudo
            </label>
            <Input
              value={pseudo}
              name="pseudo"
              size="large"
              prefix={<SmileOutlined />}
              disabled
            />
          </div>
        </div>
        <div className="row mt-4 mb-5">
          <div className="col-md-4">
            <label htmlFor="email" className="dct-talents-pulse-font-bold">
              Courrier électronique
            </label>
            <Input
              value={email}
              name="email"
              size="large"
              prefix={<MailFilled />}
              disabled
            />
          </div>
        </div>
        <Title level={2}>Addresse & Contact</Title>
        <Divider className="dct-talents-pulse-background-sliver dct-talents-pulse-without-margin" />
        <div className="row mt-4">
          <div className="col-md-3">
            <label htmlFor="country" className="dct-talents-pulse-font-bold">
              Pays de résidence
            </label>
            <Select
              name="country"
              size="large"
              value={country}
              style={{ width: "100%" }}
              disabled
            >
              {countries.map((ctry, index) => (
                <Option key={index} value={ctry.name}>
                  <Avatar src={ctry.flag} size={20} /> {ctry.name}
                </Option>
              ))}
            </Select>
          </div>
          <div className="col-md-3">
            <label htmlFor="lastName" className="dct-talents-pulse-font-bold">
              Ville/État
            </label>
            <Input
              value={address?.city}
              name="state"
              size="large"
              prefix={<AlignLeftOutlined />}
              disabled
            />
          </div>
          <div className="col-md-3">
            <label htmlFor="zipCode" className="dct-talents-pulse-font-bold">
              Code Postal
            </label>
            <Input
              value={address?.zip}
              name="zipCode"
              size="large"
              prefix={<FieldNumberOutlined />}
              disabled
            />
          </div>
          <div className="col-md-3">
            <label
              htmlFor="phoneNumber"
              className="dct-talents-pulse-font-bold"
            >
              Numéro de téléphone
            </label>
            <Input
              value={phoneNumber}
              name="phoneNumber"
              size="large"
              prefix={<PhoneFilled />}
              disabled
            />
          </div>
        </div>
        <div className="row mt-4">
          <div className="col">
            <label
              htmlFor="addressLine"
              className="dct-talents-pulse-font-bold"
            >
              Rue
            </label>
            <Input
              value={address?.lineOne}
              name="addressLine"
              size="large"
              prefix={<HomeOutlined />}
              disabled
            />
          </div>
        </div>
        <Divider />
        <div className="row justify-content-end mt-4">
          <div className="col-md-3">
            <Button
              type="primary"
              className="mb-3 dct-talents-pulse-btn-outline-secondary"
              block
              shape="round"
              size="large"
              onClick={() => navigate(END_POINT_DASHBOARD_CHANGE_PASSWORD)}
            >
              <LockFilled /> Changer Mot de Passe
            </Button>
          </div>
          <div className="col-md-3">
            <Button
              type="primary"
              className="mb-3 dct-talents-pulse-btn-secondary"
              block
              shape="round"
              size="large"
              onClick={handleOnUpdateProfile}
            >
              <UserAddOutlined /> Modifier mon Profil
            </Button>
          </div>
        </div>
        <ProfileUpdateScreen
          openDrawer={openDrawer}
          user={user}
          setUser={setUser}
          handleOnCloseDrawer={handleOnUpdateProfile}
          handleOnUpdateMember={handleOnUpdateMember}
        />
      </div>
    </DashboardLayout>
  );
};

export default ProfileScreen;
