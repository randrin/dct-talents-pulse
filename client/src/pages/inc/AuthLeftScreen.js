import React from "react";
import { Typography } from "antd";
import { END_POINT_HOME, END_POINT_LOGIN } from "../../routers/end-points";
import { CREATED_DCT_TALENTS_PULSE } from "../../utils/constants";

const AuthLeftScreen = () => {
  // States
  const currentYear = new Date().getFullYear();
  const createdYear = CREATED_DCT_TALENTS_PULSE;

  // Destructing
  const { Title, Paragraph } = Typography;

  // Render
  return (
    <>
      <div className="row dct-talents-pulse-home-top">
        <div className="col">
          <a href={END_POINT_LOGIN} title="Logo talents-pulse">
            <img height={80}
              src="/assets/images/logo-white.png"
              alt="Logo Talents Pulse"
            />
          </a>
        </div>
      </div>
      <div className="row dct-talents-pulse-home-center">
        <div className="col">
          <Title className="dct-talents-pulse-white dct-talents-pulse-home-center-title text-center">
            DCT
          </Title>
          <Paragraph className="dct-talents-pulse-white dct-talents-pulse-home-center-description text-center">
            Dossier de Compétences Techniques
          </Paragraph>
        </div>
      </div>
      {/* <Divider className="dct-talents-pulse-background-primary" /> */}
      <div className="row dct-talents-pulse-home-bottom">
        <div className="col-md-4 col-sm-12 col-xs-12">
          <div className="copyright">
            <span>Copyright ©</span>
            <span>
              {currentYear > createdYear ? (
                <span>
                  {createdYear} - {currentYear}
                </span>
              ) : (
                createdYear
              )}
            </span>
            .
            <a
              target="_blank"
              href={END_POINT_HOME}
              className="m-1 dct-talents-pulse-white"
              rel="noreferrer"
            >
              Talents Pulse
            </a>
          </div>
        </div>
        <div className="col-md-8 col-sm-12 col-xs-12">
          <div className="footer-nav d-flex">
            <div className="footer-nav-item">
              <a
                href="https://talents-pulse-demo.netlify.app/about-us"
                className="dct-talents-pulse-white"
              >
                A' Propos de nous
              </a>
            </div>
            <div className="footer-nav-item">
              <a
                href="https://talents-pulse-demo.netlify.app/services"
                className="dct-talents-pulse-white"
              >
                Nos Services
              </a>
            </div>
            <div className="footer-nav-item">
              <a
                href="https://talents-pulse-demo.netlify.app/expertises"
                className="dct-talents-pulse-white"
              >
                Nos Expertises
              </a>
            </div>
            <div>
              <a
                href="https://talents-pulse-demo.netlify.app/contact-us"
                className="dct-talents-pulse-white"
              >
                Nous Contactez
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthLeftScreen;
