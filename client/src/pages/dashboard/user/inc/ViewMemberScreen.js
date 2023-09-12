import React from "react";
import { Col, Divider, Drawer, Row, Tag, Typography } from "antd";
import moment from "moment";
import {
  talentsPulseCalculDiffDate,
  talentsPulseGetRoleIcon,
  talentsPulseGetStatusColor,
} from "../../../../utils";

const ViewMemberScreen = ({
  user,
  openViewDrawer,
  handleOnCloseViewDrawer,
}) => {
  // Destructing
  const { Title } = Typography;

  // Init
  const DescriptionItem = ({ title, content }) => (
    <div className="site-description-item-profile-wrapper">
      <p className="site-description-item-profile-p-label">
        <b>{title}</b>:
      </p>
      {content}
    </div>
  );

  // Render
  return (
    <Drawer
      width={640}
      placement="right"
      title="Détails Membre"
      onClose={handleOnCloseViewDrawer}
      open={openViewDrawer}
    >
      <Title level={2}>Informations Personnelles</Title>
      <Divider className="dct-talents-pulse-background-sliver dct-talents-pulse-without-margin" />
      <Row className="mt-3">
        <Col span={12}>
          <DescriptionItem title="Prénom" content={user.lastName} />
        </Col>
        <Col span={12}>
          <DescriptionItem title="Nom" content={user.firstName} />
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <DescriptionItem title="Sexe" content={user.gender} />
        </Col>
        <Col span={12}>
          <DescriptionItem title="Pseudo" content={user.pseudo} />
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <DescriptionItem
            title="Jour d'anniversaire"
            content={moment(user.dateOfBorn).format("LL")}
          />
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <DescriptionItem
            title="Rôle"
            content={
              <Tag
                icon={talentsPulseGetRoleIcon(user.role)}
                color={talentsPulseGetStatusColor(user.role)}
              >
                {user.role}
              </Tag>
            }
          />
        </Col>
        <Col span={12}>
          <DescriptionItem
            title="Statut"
            content={
              <Tag
                className="dct-talents-pulse-border-radius-two"
                icon={talentsPulseGetRoleIcon(user.status)}
                color={talentsPulseGetStatusColor(user.status)}
              >
                {user.status}
              </Tag>
            }
          />
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <DescriptionItem
            title="Membre depuis"
            content={talentsPulseCalculDiffDate(user.createdAt)}
          />
        </Col>
      </Row>
      <Title level={2}>Addresse</Title>
      <Divider className="dct-talents-pulse-background-sliver dct-talents-pulse-without-margin" />
      <Row className="mt-3">
        <Col span={8}>
          <DescriptionItem title="Pays" content={user.country} />
        </Col>
        <Col span={8}>
          <DescriptionItem
            title="Code Postal"
            content={user.address?.zip || "-"}
          />
        </Col>
        <Col span={8}>
          <DescriptionItem title="Ville" content={user.address?.city || "-"} />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <DescriptionItem title="Rue" content={user.address?.lineOne || "-"} />
        </Col>
      </Row>
      <Title level={2}>Contacts</Title>
      <Divider className="dct-talents-pulse-background-sliver dct-talents-pulse-without-margin" />
      <Row className="mt-3">
        <Col span={12}>
          <DescriptionItem title="Email" content={user.email} />
        </Col>
        <Col span={12}>
          <DescriptionItem
            title="Numéro de téléphone"
            content={user.phoneNumber || "-"}
          />
        </Col>
      </Row>
    </Drawer>
  );
};

export default ViewMemberScreen;
