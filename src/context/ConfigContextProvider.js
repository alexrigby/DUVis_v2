import { useState, useEffect } from "react";
import ConfigContext from "./ConfigContext";
import configHandler from "../grammar/configHandler";
import _config from "../grammar/config.json";

export function ConfigContextProvider({ children }) {
  const [config, setConfig] = useState(null);
  // runs once when add is loaded
  useEffect(() => {
    //adding the config details to ref
    const { configObj, errors } = configHandler(_config);

    setConfig(configObj);
    // configRef.current = config;
  }, []);

  return <ConfigContext.Provider value={{ config, setConfig }}>{children}</ConfigContext.Provider>;
}

export default ConfigContextProvider;
