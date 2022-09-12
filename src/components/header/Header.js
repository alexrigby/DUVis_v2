import "./Header.css";
import LAYOUTS from "../cytoscape/functions/cyLayouts";
import STORIES from "../../configs/stories";
import { useState } from "react";

export function Header({ cyState, datesRef, setPrPeriod, prPeriod }) {
  const [filterOptionsDisplay, setFilterOptionsDisplay] = useState(false);
  const [prSectionDisplay, setPrSectionDisplay] = useState(false);
  const [storySectionDisplay, setStorySectionDisplay] = useState(false);

  const storyButtons = STORIES.map((story, i) => (
    <p key={story.name} value={story.ids}>
      {i + 1}. {story.name}
    </p>
  ));

  function changeLayout() {
    cyState.cy.layout(LAYOUTS.FCOSERandom).run();
  }

  //hides/displays wpedges/ activity edges when button is clicked
  const changeEdgeDisplay = (event) => {
    cyState.cy.edges("[type != 'wpEdge']").toggleClass("show");
    cyState.cy.edges("[type = 'wpEdge']").toggleClass("hide");
  };

  const displayFilterOptions = (event) => {
    setFilterOptionsDisplay((prevState) => !prevState);
    setPrSectionDisplay(false); //hides open prperiod optons when filter optiosn is clicked
    setStorySectionDisplay(false);
  };

  const displayStoryOptions = (event) => {
    setStorySectionDisplay((preveState) => !preveState);
  };

  const displayPrOptions = (event) => {
    setPrSectionDisplay((prevState) => !prevState);
    //resets proptons when button is clicked
    setPrPeriod({
      pr: 13,
      undefined: true,
    });
  };

  //sets prperod to selected radio button
  const prClickHandler = (event) => {
    setPrPeriod((prevState) => ({
      pr: event.target.type === "radio" ? parseFloat(event.target.value) : prevState.pr,
      undefined: event.target.type === "checkbox" ? !prevState.undefined : prevState.undefined,
    }));
  };

  //allows user to set pr period using the arrow buttons
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

  const optionsStyle = {
    display: filterOptionsDisplay ? "block" : "none",
  };
  const storyStyle = {
    display: storySectionDisplay ? "block" : "none",
  };
  const prStyle = {
    display: prSectionDisplay ? "flex" : "none",
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
      <button onClick={changeEdgeDisplay}>Activity Connections</button>

      <div>
        <button onClick={displayFilterOptions}>
          Filter Activities
          {filterOptionsDisplay ? <i className="fa fa-angle-up"></i> : <i className="fa fa-angle-down"> </i>}
        </button>
        <div style={optionsStyle}>
          <button onClick={displayStoryOptions}>
            By Story {storySectionDisplay ? <i className="fa fa-angle-up"></i> : <i className="fa fa-angle-down"> </i>}
          </button>
          <button onClick={displayPrOptions}>
            By Progress Report Period
            {prSectionDisplay ? <i className="fa fa-angle-up"></i> : <i className="fa fa-angle-down"> </i>}
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
          <div className="storyButtons" style={storyStyle}>
            {storyButtons}
          </div>
        </div>
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
