import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import "remixicon/fonts/remixicon.css";
import TalentsPulseRouters from "./routers/talents-pulse-routers";
import { BrowserRouter } from "react-router-dom";
import { FloatButton } from "antd";

const root = ReactDOM.createRoot(document.getElementById("DCT"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <TalentsPulseRouters />
      <FloatButton.BackTop />
    </BrowserRouter>
  </React.StrictMode>
);
