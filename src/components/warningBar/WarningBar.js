import { useState } from "react";

import "./WarningBar.css";

export function WarningBar({ fieldWarning, setWarningBarDisplay }) {
  //   const OPEN = <i className="fa fa-angle-down"></i>;
  //   const CLOSE = <i className="fa fa-angle-up"></i>;

  const [extendedWarning, setExtendedWaring] = useState(false);

  const totalWarnings = Object.values(fieldWarning).reduce((a, b) => a + b.length, 0);

  const expandWarning = (evt) => {
    setExtendedWaring((prevState) => !prevState);
  };

  const hideWarningBar = (evt) => {
    setWarningBarDisplay(false);
  };

  //comma seperated list of errors for every worksheet/config file
  const extWarnText = Object.keys(fieldWarning).map((sheet) => {
    return (
      <div key={sheet}>
        <h3>{sheet}</h3>
        <p>{fieldWarning[sheet].map((s, i) => (i < fieldWarning[sheet].length - 1 ? `"${s}", ` : `"${s}"`))}</p>
      </div>
    );
  });

  const barStyle = { height: extendedWarning ? "auto" : "17px" };

  return (
    <div className="warningBar" style={barStyle}>
      <p>
        <i className="fa fa-triangle-exclamation" onClick={expandWarning} title="click to expand"></i> :{" "}
        {!extendedWarning &&
          totalWarnings + " minor errors detected in the config / dataset that may cause unexpected results "}
        {/* <span onClick={openWarning}>{extendedWarning ? CLOSE : OPEN}</span> */}
        <span>
          <i className="fa fa-window-close" aria-hidden="true" title="click to dismiss" onClick={hideWarningBar}></i>
        </span>
      </p>
      {extendedWarning && (
        <div>
          <p>The following fields specified in the config file were not detected in the provided dataset. </p>
          <p>If you intended on including these fields, please check for spelling mistakes (case sensative). </p>
          <p>
            {" "}
            If you do not intend to include these fields: for meta fields remove the field from the array, for
            compulsory fields replace the specified value with <b>null</b>
          </p>
          {extWarnText}
        </div>
      )}
    </div>
  );
}

export default WarningBar;
