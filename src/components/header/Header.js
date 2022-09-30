import "./Header.css";
import LAYOUTS from "../cytoscape/functions/cyLayouts";
import { useEffect } from "react";

export function Header({
  cyState,
  datesRef,
  prPeriod,
  currentStory,
  setActivityEdgeDisplay,
  setCompletedDisplay,
  completedDisplay,
  selectedBottomVis,
  setSelectedBottomVis,
  setConnectionFlagsDisplay,
  connectionFlagsDisplay,
}) {
  // TOGGLE CONTROLS /////////////
  function changeLayout() {
    cyState.cy.layout(LAYOUTS.FCOSERandom).run();
  }
  const toggleCompleted = (event) => {
    event.target.classList.toggle("activeButton");
    setCompletedDisplay((prevState) => !prevState);
  };
  //hides/displays wpedges/ activity edges when button is clicked
  const toggleEdges = (event) => {
    event.target.classList.toggle("activeButton");
    setActivityEdgeDisplay((prevState) => !prevState);
  };

  const toggleConnectionFlags = (event) => {
    event.target.classList.toggle("activeButton");
    setConnectionFlagsDisplay((prevState) => !prevState);
  };

  // every time button is clicked the style of flagged activities is chnaged
  useEffect(() => {
    const nodeEdges = cyState.cy.nodes('[type = "activityNode"]').map((node) => node.connectedEdges().length);
    const meanEdges = nodeEdges.reduce((a, b) => a + b, 0) / nodeEdges.length; //gets average edges per node
    if (connectionFlagsDisplay === true) {
      cyState.cy
        .nodes('[type = "activityNode"]')
        .map((node) => node.connectedEdges().length < meanEdges && node.addClass("lowConnections"));
    } else {
      cyState.cy.nodes('[type = "activityNode"]').removeClass("lowConnections");
    }
  }, [connectionFlagsDisplay, cyState.cy]);

  const toggleBottomPannelDisplay = (event) => {
    const target = event.currentTarget.id;
    setSelectedBottomVis((prevState) => (prevState === target ? "" : target)); //if the same button is  clicked twice set state to ""
  };
  // TOGGLE CONTROLS /////////////

  //STYLING //////////////////////
  const ganttButtonstyle = {
    backgroundColor: selectedBottomVis === "gantChartButton" ? " #cfcfcf" : "#e4e4e4",
  };

  const anyliticsButtonStyle = {
    backgroundColor: selectedBottomVis === "vegaAnalyticsButton" ? " #cfcfcf" : "#e4e4e4",
  };

  //STYLING //////////////////////

  return (
    <header>
      <div className="topLine">
        <div className="headSection">
          <h1>Dwr Uisce Work Package Visualiser</h1>
          <p className="subHeader">
            {currentStory === null ? "All Activities" : currentStory.name}
            {" || "}
            {datesRef.current !== null && prStartAndEndDate(datesRef, prPeriod).start} -{" "}
            {datesRef.current !== null && prStartAndEndDate(datesRef, prPeriod).end}{" "}
            {completedDisplay !== false &&
              "|| " +
                completedActivityInfo(prPeriod, cyState.cy, datesRef.current, "completed") +
                " completed - " +
                completedActivityInfo(prPeriod, cyState.cy, datesRef.current, "ongoing") +
                " ongoing "}
          </p>
        </div>
        <div className="displayButtons">
          <div className="toggleButtons">
            <button onClick={changeLayout}>Change Layout </button>
            <button onClick={toggleEdges}>Toggle Connections</button>
            <button onClick={toggleCompleted}>Toggle Completed </button>
            <button title="flag activities with less than mean number of connections" onClick={toggleConnectionFlags}>
              Mean Connection Flag
            </button>
          </div>
          <div className="bottomPannelButtons">
            <button id="gantChartButton" onClick={toggleBottomPannelDisplay} style={ganttButtonstyle}>
              Gantt Chart
            </button>
            <button id="vegaAnalyticsButton" onClick={toggleBottomPannelDisplay} style={anyliticsButtonStyle}>
              Analytics
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;

// converts dates to nice format
function prStartAndEndDate(datesRef, prPeriod) {
  const pr = prPeriod.pr === null ? datesRef.current[datesRef.current.length - 1].prPeriod : prPeriod.pr;
  const prDates = datesRef.current.filter((date) => pr === date.prPeriod);

  const start = String(
    new Date(datesRef.current[0].date).toLocaleDateString("en-GB", { month: "short", year: "numeric" })
  );
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

function completedActivityInfo(prPeriod, cy, dates, co) {
  const latestPrPeriod = dates[dates.length - 1].prPeriod;
  if (co === "ongoing") {
    if (prPeriod.pr === null) {
      return cy !== null && cy.nodes(`[meta.endPrPeriod > "${latestPrPeriod}"]`).length;
    } else {
      return cy !== null && cy.nodes(`[meta.endPrPeriod > "${prPeriod.pr}"]`).length;
    }
  } else if (co === "completed") {
    if (prPeriod.pr === null) {
      return (
        cy !== null &&
        cy.nodes('[type ="activityNode"]').length - cy.nodes(`[meta.endPrPeriod > "${latestPrPeriod}"]`).length
      );
    } else {
      return (
        cy !== null &&
        cy.nodes('[type ="activityNode"]').length - cy.nodes(`[meta.endPrPeriod > "${prPeriod.pr}"]`).length
      );
    }
  }
}
