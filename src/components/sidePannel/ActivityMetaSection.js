import nodeNavigationHandler from "./functions/nodeNavigationHandler";
import hilightOnLiHover from "./functions/hilightOnLiHover";
import { actFields } from "../../data";

export function ActivityMetaSection({ selectedNode, cyState, setSelectedNode, datesRef, prPeriod }) {
  const meta = selectedNode.meta;
  const outgoingActivities = cyState.cy.nodes(`[id = "${selectedNode.id}"]`).outgoers().targets();
  const incommingActivities = cyState.cy.nodes(`[id = "${selectedNode.id}"]`).incomers().sources();
  const uniqueLinks = [...new Set([...incommingActivities, ...outgoingActivities])];

  const latestPrPeriod = datesRef.current[datesRef.current.length - 1].prPeriod;

  function completedStyle() {
    if (prPeriod.pr === null) {
      if (selectedNode.meta.endPrPeriod === "undefined" || selectedNode.meta.endPrPeriod === "onGoing") {
        return { color: "#ffbf00" };
      } else {
        return { color: selectedNode.meta.endPrPeriod <= latestPrPeriod ? "#39ff14" : "#ffbf00" };
      }
    } else {
      return { color: selectedNode.meta.endPrPeriod <= prPeriod.pr ? "#39ff14" : "#ffbf00" };
    }
  }

  const flagTextStyle = {
    color: "#FFBF00",
    opacity: "0.7",
  };

  const datesStyle = {
    opacity: 0.7,
  };

  function flagText() {
    if (selectedNode !== null) {
      const allNodeEdges = cyState.cy.nodes('[type = "activityNode"]').map((node) => node.connectedEdges().length);
      const meanEdges = allNodeEdges.reduce((a, b) => a + b, 0) / allNodeEdges.length; //gets average edges per node
      const nodeEdges = cyState.cy.nodes(`[id = "${selectedNode.id}"]`).connectedEdges();
      if (nodeEdges.length < meanEdges) {
        return (
          <p>
            1. <span style={flagTextStyle}>Less than the mean number of connections</span>
          </p>
        );
      } else {
        return <p style={{ color: "green", opacity: "0.8" }}>none</p>;
      }
    }
  }

  function completedText() {
    if (prPeriod.pr === null) {
      if (selectedNode.meta.endPrPeriod === "undefined" || selectedNode.meta.endPrPeriod === "onGoing") {
        return "Ongoing";
      } else {
        return selectedNode.meta.endPrPeriod <= latestPrPeriod ? "Completed" : "Ongoing";
      }
    } else {
      return selectedNode.meta.endPrPeriod <= prPeriod.pr ? "Completed" : "Ongoing";
    }
  }

  const linkedActivitiesList = uniqueLinks.map((activity) => (
    <li
      key={activity.id()}
      onClick={() => nodeNavigationHandler(activity.id(), setSelectedNode, cyState)}
      onMouseOver={() => hilightOnLiHover(activity.id(), cyState)}
      onMouseOut={() => hilightOnLiHover(activity.id(), cyState)}
    >
      {activity.id()}. {activity.data().name}
    </li>
  ));

  return (
    <div>
      <div className="metaSection">
        <h1>
          {meta.ID}. {meta[actFields.ACTIVITY]}
        </h1>
        <h1
          onClick={() => nodeNavigationHandler(selectedNode.parent, setSelectedNode, cyState)}
          className="navigateToWp"
        >
          WP: {selectedNode.parent.slice(2)}
        </h1>
        <p style={completedStyle()} className="completed">
          {/* {meta["Activity Status"]} */}
          {completedText()}
        </p>
        <h2>Flags:</h2>
        {flagText()}
        <h2>Start - End:</h2>
        <p>
          <span style={datesStyle}> Date: </span> {shortDates(meta, "start")} - {shortDates(meta, "end")}
        </p>
        <p>
          <span style={datesStyle}> Months: </span> {meta[actFields.STARTM]} - {meta[actFields.ENDM]}
        </p>
        <p>
          <span style={datesStyle}> PR Period: </span> {meta.startPrPeriod} -{" "}
          {meta.endPrPeriod === "onGoing" ? "Ongoing" : meta.endPrPeriod}
        </p>
        <h2> Category:</h2> <p>{meta[actFields.CATEGORY]}</p>
        <h2> Researcher:</h2> <p>{meta[actFields.RESEARCHER]}</p>
        <h2> End Users: </h2> <p>{meta[actFields.ENDUSER]}</p>
        <h2> PDCA Cycle: </h2> <p>{meta[actFields.PDCA]}</p>
        <h2> Contribution to DU: </h2> <p>{meta[actFields.PROJECTCONTRIBUTION]}</p>
      </div>
      <div className="metaSection">
        <h1>DESCRIPTION: </h1> <p>{meta[actFields.DESCRIPTION]}</p>
      </div>
      <div className="metaSection">
        <h1>RESEARCH: </h1>
        <h2>Question Type:</h2> {researchQuestionType(meta)}
        <h2>Question:</h2> <p> {meta[actFields.QUESTION]} </p>
      </div>
      <div className="metaSection">
        <h1>METHODOLOGY:</h1>
        <h2>Category:</h2> <p>{meta[actFields.CATEGORY]}</p>
        <h2>Methodology: </h2> <p>{meta[actFields.METHOD]} </p>
      </div>
      <div className="metaSection">
        <h1>DATA: </h1>
        <h2>Procurement Method: </h2> <p>{meta[actFields.DATAMETHOD]} </p>
        <h2>Type:</h2> <p>{meta[actFields.DATATYPE]}</p>
        <h2>Usage:</h2> <p>{meta[actFields.DATAUSAGE]}</p>
      </div>
      <div className="metaSection">
        <h1>DISCIPLINE: </h1>
        <h2>Category: </h2> <p>{meta[actFields.CATEGORY]}</p>
        <h2>Specific Perspective:</h2> <p>{meta[actFields.PERSPECTIVES]}</p>
        <h2>Transdisciplinary Perspectives:</h2> <p>{meta[actFields.TDPERSPECTIVE]}</p>
      </div>
      <div className="metaSection">
        <h1>IERLAND WATER: </h1>
        <h2>Aims and Objectives: </h2> <p>{meta[actFields.IW]}</p>
        <h2>Contribution:</h2> <p>{meta[actFields.IWCONTRIBUTION]}</p>
      </div>
      <div className="metaSection">
        <h1>LINKED ACTIVITIES: </h1>
        <ul>{linkedActivitiesList}</ul>
      </div>
    </div>
  );
}

export default ActivityMetaSection;

function researchQuestionType(meta) {
  if (meta[actFields.QTYPE2] === "") {
    return <p>{meta[actFields.QTYPE]}</p>;
  } else {
    return (
      <p>
        {meta[actFields.QTYPE]} + {meta[actFields.QTYPE2]}
      </p>
    );
  }
}

function shortDates(node, se) {
  if (se === "end") {
    if (node.endDate === "onGoing" || node.endDate === "undefined") {
      return "Ongoing";
    } else {
      return new Date(node.endDate).toLocaleDateString("en-GB", { month: "short", year: "numeric" });
    }
  } else if (se === "start") {
    if (node.startDate === "undefined") {
      return "undefined";
    } else {
      return new Date(node.startDate).toLocaleDateString("en-GB", { month: "short", year: "numeric" });
    }
  }
}
