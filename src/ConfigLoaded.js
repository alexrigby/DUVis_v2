import { useContext } from "react";
import ConfigContext from "./context/ConfigContext";

import App from "./App";

export function ConfigLoaded() {
  const configRef = useContext(ConfigContext);
  console.log(configRef);
  if (configRef.current) {
    return <App />;
  }
}

export default ConfigLoaded;
