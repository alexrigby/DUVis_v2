import "./Header.css";
import LAYOUTS from "../cytoscape/functions/cyLayouts";
import { useState } from "react";

export function Header({ cyState, dates }) {
  const [openPrSection, setOpenPrSection] = useState(false);

  function changeLayout() {
    cyState.cy.layout(LAYOUTS.COSE).run();
  }

  const displayPrOptions = (event) => {
    setOpenPrSection((prevState) => !prevState);
  };

  const prClickHandler = (event) => {
    console.log(event.target.value);
  };

  const prStyle = {
    display: openPrSection ? "flex" : "none",
  };

  const prOptions = dates.current !== null && [...new Set(dates.current.map((p) => p.prPeriod))];

  const prRadio =
    dates.current !== null &&
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
    </header>
  );
}

export default Header;
