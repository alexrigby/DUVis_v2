import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import ConfigContextProvider from "./context/ConfigContextProvider";

import App from "./App";
import ConfigLoaded from "./ConfigLoaded";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <ConfigContextProvider>
    <App />
  </ConfigContextProvider>
);
