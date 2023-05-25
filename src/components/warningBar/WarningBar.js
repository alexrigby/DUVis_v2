import { useState, useContext } from "react";
import ConfigContext from "../../context/ConfigContext";
import "./WarningBar.css";

export function WarningBar({ fieldWarning, setWarningBarDisplay }) {
  const { config } = useContext(ConfigContext);
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
  const extWarnText = Object.keys(fieldWarning).map((warning) => {
    return (
      <div key={warning}>
        <h3>{warning}</h3>
        <p>{fieldWarning[warning].map((s, i) => (i < fieldWarning[warning].length - 1 ? `"${s}", ` : `"${s}"`))}</p>
      </div>
    );
  });

  var fieldWarningText = [];
  var parentlessNodeText = [];

  for (let i = 0; i < Object.keys(fieldWarning).length; i++) {
    const warning = Object.keys(fieldWarning)[i];
    if (warning === "parentlessNodes") {
      parentlessNodeText.push(
        <div key={warning}>
          <h3>Parentless Nodes</h3>
          <p>
            Specify a {config.actFields.WP} in the {config.WORKSHEETS.ACTIVITIES} worksheet to dispaly nodes:{" "}
            {fieldWarning[warning].map((s, i) => (i < fieldWarning[warning].length - 1 ? `"${s}", ` : `"${s}"`))}{" "}
          </p>
        </div>
      );
    } else {
      fieldWarningText.push(
        <div key={warning}>
          <h4
            style={{
              fontWeight: 900,
              fontSize: "9.5pt",
              display: "inline-block",
              paddingRight: "5px",
              paddingTop: "5px",
              margin: 0,
            }}
          >
            {warning}:{" "}
          </h4>
          <p style={{ display: "inline-block" }}>
            {fieldWarning[warning].map((s, i) => (i < fieldWarning[warning].length - 1 ? `"${s}", ` : `"${s}"`))}
          </p>
        </div>
      );
    }
  }

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
          {parentlessNodeText}
          <h3>Fields</h3>

          <p>The following fields specified in the config file were not detected in the provided dataset. </p>
          <p>If you intended on including these fields, please check for spelling mistakes (case sensative). </p>
          <p>
            {" "}
            If you do not intend to include these fields: for meta fields remove the field from the array, for
            compulsory fields replace the specified value with <b>null</b>
          </p>
          {fieldWarningText}
        </div>
      )}
    </div>
  );
}

export default WarningBar;
