import { useState, useEffect } from "react";
import ConfigContext from "./ConfigContext";
import configHandler from "../grammar/configHandler";

export function ConfigContextProvider({ children }) {
  const [config, setConfig] = useState(null);
  // runs once when add is loaded
  useEffect(() => {
    //adding the config details to ref
    const config = configHandler();
    setConfig(config);
    console.log(config);
    // configRef.current = config;
  }, []);

  return <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>;
}

export default ConfigContextProvider;
