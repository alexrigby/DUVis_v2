import "./Header.css";
import LAYOUTS from "../cytoscape/functions/cyLayouts";
import { useState } from "react";

export function Header({ cyState, datesRef, setPrPeriod, prPeriod }) {
  const [openPrSection, setOpenPrSection] = useState(false);

  function changeLayout() {
    cyState.cy.layout(LAYOUTS.FCOSERandom).run();
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

  const scrollHandler = (event) => {
    // console.log(event.currentTarget.id);
    if (event.currentTarget.id === "forwardButton") {
      setPrPeriod((prevState) => ({
        ...prevState,
        pr: prevState.pr >= 13 ? 13 : prevState.pr + 1,
      }));
    } else if (event.currentTarget.id === "backButton") {
      setPrPeriod((prevState) => ({
        ...prevState,
        pr: prevState.pr <= 1 ? 1 : prevState.pr - 1,
      }));
    }
  };

  const prStyle = {
    display: openPrSection ? "flex" : "none",
  };

  const prOptions = datesRef.current !== null && [...new Set(datesRef.current.map((p) => p.prPeriod))];

  const prRadio =
    datesRef.current !== null &&
    prOptions.map((opt, i) => (
      <div className="radioGroup" key={opt}>
        <label htmlFor="prPeriod">{opt}</label>
        <input
          type="radio"
          id={opt}
          name="prPeriod"
          value={opt}
          onChange={prClickHandler}
          checked={prPeriod.pr - 1 === i} //check the current pr period
        ></input>
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

      {datesRef.current !== null && (
        <p style={prStyle}>
          {prStartAndEndDate(datesRef, prPeriod).start} - {prStartAndEndDate(datesRef, prPeriod).end}
        </p>
      )}
      <div className="prSelection" style={prStyle}>
        {prRadio}
        <button id="backButton" onClick={scrollHandler}>
          <i className="fa fa-angles-left"></i>
        </button>
        <button id="forwardButton" onClick={scrollHandler}>
          <i className="fa fa-angles-right"></i>
        </button>
      </div>
      <div className="undefinedCheck" style={prStyle}>
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

function prStartAndEndDate(datesRef, prPeriod) {
  const prDates = datesRef.current.filter((date) => prPeriod.pr === date.prPeriod);

  const start = String(new Date(prDates[0].date).toLocaleDateString("en-GB", { month: "short", year: "numeric" }));
  const end = String(
    new Date(prDates[prDates.length - 1].date).toLocaleDateString("en-GB", {
      month: "short",
      year: "numeric",
    })
  );

  return {
    start: start,
    end: end,
  };
}
