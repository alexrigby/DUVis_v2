import { useContext } from "react";

import "./Header.css";
import ConfigContext from "../../context/ConfigContext";

export function Header({
  cyState,
  datesRef,
  prPeriod,
  currentStory,
  completedDisplay,
  networkVeiw,
  warningBarDisplay,
  setWarningBarDisplay,
  fieldWarning,
}) {
  const { config } = useContext(ConfigContext);
  const INCLUDE_DATES = config.INCLUDE_DATES;

  const totalWarnings = fieldWarning && Object.values(fieldWarning).reduce((a, b) => a + b.length, 0);

  const expandWarning = (evt) => {
    setWarningBarDisplay(true);
  };

  return (
    <header>
      <div>
        <h1>{config.NAME} </h1>

        <div className="subHeader">
          {!warningBarDisplay && (
            <div className="warning">
              <sup>{totalWarnings}</sup>
              <i className="fa fa-triangle-exclamation" onClick={expandWarning} title="click to expand">
                {" "}
              </i>
            </div>
          )}
          {!warningBarDisplay && ` || `}
          {currentStory === null ? "All Activities" : currentStory.name}
          {}
          {INCLUDE_DATES && datesRef.current !== null && ` || ` + prStartAndEndDate(datesRef, prPeriod).start + ` - `}
          {INCLUDE_DATES && datesRef.current !== null && prStartAndEndDate(datesRef, prPeriod).end}{" "}
          {completedDisplay !== false &&
            "|| " +
              completedActivityInfo(prPeriod, cyState.cy, datesRef.current, "completed", networkVeiw) +
              " completed - " +
              completedActivityInfo(prPeriod, cyState.cy, datesRef.current, "ongoing", networkVeiw) +
              " ongoing "}
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

function completedActivityInfo(prPeriod, cy, dates, co, networkVeiw) {
  const nodeSelector = networkVeiw ? '[network = "yes"]' : '[type = "activityNode"]';

  const latestPrPeriod = dates[dates.length - 1].prPeriod;
  if (co === "ongoing") {
    if (prPeriod.pr === null) {
      return cy.nodes(`${nodeSelector}[dates.endPrPeriod >= "${latestPrPeriod}"]`).length;
    } else {
      return cy.nodes(`${nodeSelector}[dates.endPrPeriod >= "${prPeriod.pr}"]`).length;
    }
  } else if (co === "completed") {
    if (prPeriod.pr === null) {
      return (
        cy.nodes(`${nodeSelector}[type ="activityNode"]`).length -
        cy.nodes(`${nodeSelector}[dates.endPrPeriod >= "${latestPrPeriod}"]`).length
      );
    } else {
      return (
        cy.nodes(`${nodeSelector}[type ="activityNode"]`).length -
        cy.nodes(`${nodeSelector}[dates.endPrPeriod >= "${prPeriod.pr}"]`).length
      );
    }
  }
}
