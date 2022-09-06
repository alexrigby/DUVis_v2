import "./Header.css";
import LAYOUTS from "../cytoscape/functions/cyLayouts";
import { useState } from "react";

export function Header({ cyState, datesRef, setPrPeriod }) {
  const [openPrSection, setOpenPrSection] = useState(false);

  function changeLayout() {
    cyState.cy.layout(LAYOUTS.COSE).run();
  }

  const displayPrOptions = (event) => {
    setOpenPrSection((prevState) => !prevState);
    setPrPeriod({
      pr: 13,
      undefined: true,
    });
  };

  const prClickHandler = (event) => {
    setPrPeriod((prevState) => ({
      pr: event.target.type === "radio" ? parseFloat(event.target.value) : prevState.pr,
      undefined: event.target.type === "checkbox" ? !prevState.undefined : prevState.undefined,
    }));
  };

  const prStyle = {
    display: openPrSection ? "flex" : "none",
  };

  const undefCheckStyle = {
    display: openPrSection ? "flex" : "none",
  };

  const prOptions = datesRef.current !== null && [...new Set(datesRef.current.map((p) => p.prPeriod))];

  const prRadio =
    datesRef.current !== null &&
    prOptions.map((opt) => (
      <div className="radioGroup" key={opt}>
        <label htmlFor="prPeriod">{opt}</label>
        <input type="radio" id={opt} name="prPeriod" value={opt} onChange={prClickHandler}></input>
      </div>
    ));

  return (
    <header>
      <h1>Dwr Uisce Work Package Visualiser</h1>
      <button onClick={changeLayout}>Change Layout </button>
      <button onClick={displayPrOptions}>
        Progress Report Period
        {openPrSection ? <i className="fa fa-angle-up"></i> : <i className="fa fa-angle-down"> </i>}
      </button>

      <div className="prSelection" style={prStyle}>
        {prRadio}
      </div>
      <div className="undefinedCheck" style={undefCheckStyle}>
        <label htmlFor="prPeriod">Include Undefined</label>
        <input
          type="checkBox"
          id="undef"
          name="prPeriod"
          value="undef"
          onChange={prClickHandler}
          defaultChecked={true}
        ></input>
      </div>
    </header>
  );
}

export default Header;
