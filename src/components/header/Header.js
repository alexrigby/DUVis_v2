import "./Header.css";

export function Header({ cyState, datesRef, prPeriod, currentStory, completedDisplay, networkVeiw }) {
  return (
    <header>
      <div>
        <h1>D{"\u0175"}r Uisce Work Package Visualiser</h1>
        <p className="subHeader">
          {currentStory === null ? "All Activities" : currentStory.name}
          {" || "}
          {datesRef.current !== null && prStartAndEndDate(datesRef, prPeriod).start} -{" "}
          {datesRef.current !== null && prStartAndEndDate(datesRef, prPeriod).end}{" "}
          {completedDisplay !== false &&
            "|| " +
              completedActivityInfo(prPeriod, cyState.cy, datesRef.current, "completed", networkVeiw) +
              " completed - " +
              completedActivityInfo(prPeriod, cyState.cy, datesRef.current, "ongoing", networkVeiw) +
              " ongoing "}
        </p>
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
      return cy.nodes(`${nodeSelector}[meta.endPrPeriod >= "${latestPrPeriod}"]`).length;
    } else {
      return cy.nodes(`${nodeSelector}[meta.endPrPeriod >= "${prPeriod.pr}"]`).length;
    }
  } else if (co === "completed") {
    if (prPeriod.pr === null) {
      return (
        cy.nodes(`${nodeSelector}[type ="activityNode"]`).length -
        cy.nodes(`${nodeSelector}[meta.endPrPeriod >= "${latestPrPeriod}"]`).length
      );
    } else {
      return (
        cy.nodes(`${nodeSelector}[type ="activityNode"]`).length -
        cy.nodes(`${nodeSelector}[meta.endPrPeriod >= "${prPeriod.pr}"]`).length
      );
    }
  }
}
