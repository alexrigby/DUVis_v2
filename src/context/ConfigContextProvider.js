import { useRef, useEffect } from "react";
import ConfigContext from "./ConfigContext";
import configHandler from "../grammar/configHandler";

export function ConfigContextProvider({ children }) {
  const configRef = useRef(null);
  // runs once when add is loaded
  useEffect(() => {
    //adding the config details to ref
    const config = configHandler();
    configRef.current = config;
  }, []);

  return <ConfigContext.Provider value={configRef}>{children}</ConfigContext.Provider>;
}

export default ConfigContextProvider;
