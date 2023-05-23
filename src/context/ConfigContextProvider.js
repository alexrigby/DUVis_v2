import { useState, useEffect } from "react";
import ConfigContext from "./ConfigContext";
import configHandler from "../grammar/configHandler";
import _config from "../data/config - full.json";

export function ConfigContextProvider({ children }) {
  const [config, setConfig] = useState(null);
  // runs once when add is loaded
  useEffect(() => {
    // const localConfig = JSON.parse(window.localStorage.getItem("config"));

    //adding the config details to state
    // if (localConfig) {
    const { configObj, errors } = configHandler(_config);

    setConfig(configObj);
    // } else {
    //   setConfig(null);
    // }
  }, []);

  return <ConfigContext.Provider value={{ config, setConfig }}>{children}</ConfigContext.Provider>;
}

export default ConfigContextProvider;
