import nodeNavigationHandler from "./functions/nodeNavigationHandler";
import hilightOnLiHover from "./functions/hilightOnLiHover";
import engLevelWording from "../../configs/engLevelWording";
import { actFields } from "../../data";
import { useState } from "react";

export function ActivityMetaSection({
  selectedNode,
  cyState,
  setSelectedNode,
  datesRef,
  prPeriod,
  networkVeiw,
  setStakeholdersDisplay,
}) {
  const meta = selectedNode.meta;
  const OPEN = <i className="fa fa-angle-down"></i>;
  const CLOSE = <i className="fa fa-angle-up"></i>;
  const ENG_COUNT = Array.from(Array(engLevelWording.length).keys());
  const SUBSECTIONS = ["description", "research", "method", "data", "discipline", "IW", "activity", "stakeholder"];

  const engObj = ENG_COUNT.reduce((p, c) => ({ ...p, [`eng${c}`]: false }), {}); //adds each engement level to object {eng(n): false}
  const subSectionObj = SUBSECTIONS.reduce((p, c) => ({ ...p, [c]: false }), {}); // each subsection to onject- false

  const [actAccordion, setActAccordion] = useState({ ...engObj, ...subSectionObj });

  const outgoingActivities = cyState.cy
    .nodes(`[id = "${selectedNode.id}"]`)
    .outgoers()
    .targets('[type != "stakeholderNode"]');

  const incommingActivities = cyState.cy
    .nodes(`[id = "${selectedNode.id}"]`)
    .incomers()
    .sources('[type != "stakeholderNode"]');

  const uniqueActLinks = [...new Set([...incommingActivities, ...outgoingActivities])];

  const latestPrPeriod = datesRef.current[datesRef.current.length - 1].prPeriod;

  function completedStyle() {
    if (prPeriod.pr === null) {
      if (selectedNode.meta.endPrPeriod === "undefined" || selectedNode.meta.endPrPeriod === "onGoing") {
        return { color: "#ffbf00", opacity: "1" };
      } else {
        return { color: selectedNode.meta.endPrPeriod < latestPrPeriod ? "#1fc700" : "#ffbf00", opacity: "1" };
      }
    } else {
      if (selectedNode.meta.endPrPeriod === "undefined" || selectedNode.meta.endPrPeriod === "onGoing") {
        return { color: "#ffbf00", opacity: "1" };
      } else if (selectedNode.meta.startPrPeriod > prPeriod.pr) {
        return { color: "#EE4B2B", fontSize: "15pt", fontWeight: "900", opacity: "1" };
      } else {
        return { color: selectedNode.meta.endPrPeriod < prPeriod.pr ? "#1fc700" : "#ffbf00", opacity: "1" };
      }
    }
  }

  const datesStyle = {
    opacity: 1,
    fontWeight: 550,
  };

  function completedText() {
    if (prPeriod.pr === null) {
      if (selectedNode.meta.endPrPeriod === "undefined" || selectedNode.meta.endPrPeriod === "onGoing") {
        return "Ongoing";
      } else {
        return selectedNode.meta.endPrPeriod < latestPrPeriod ? "Completed" : "Ongoing";
      }
    } else {
      if (selectedNode.meta.endPrPeriod === "undefined" || selectedNode.meta.endPrPeriod === "onGoing") {
        return "Ongoing";
      } else if (selectedNode.meta.startPrPeriod > prPeriod.pr) {
        return "Not Started";
      } else {
        return selectedNode.meta.endPrPeriod < prPeriod.pr ? "Completed" : "Ongoing";
      }
    }
  }

  // if (prPeriod.pr === null || ) {
  //   console.log(true);
  // }

  const linkedActivitiesList = uniqueActLinks.map((activity) => (
    <li
      key={activity.id()}
      onClick={() => nodeNavigationHandler(activity.id(), setSelectedNode, cyState, setStakeholdersDisplay)}
      onMouseOver={() => hilightOnLiHover(activity.id(), cyState)}
      onMouseOut={() => hilightOnLiHover(activity.id(), cyState)}
    >
      {activity.id()}. {activity.data().name}
    </li>
  ));

  const openActAccordion = (event, key) => {
    setActAccordion((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };
  const stakeholderList = [];
  const stakeholderCollection = [];

  //4 for 4 engagement levels
  for (let i = 0; i < ENG_COUNT.length; i++) {
    //get collections of conected nodes by engagemnet level
    const stakeholders = cyState.cy
      .nodes(`[id = "${selectedNode.id}"]`)
      .incomers(`[engagement = "${i + 1}"]`)
      .sources('[type = "stakeholderNode"]');

    stakeholderCollection.push(stakeholders.flat());
    const style = {
      display: actAccordion[`eng${i}`] ? "block" : "none",
    };

    //only push lists that have nodes
    if (stakeholders.length !== 0) {
      stakeholderList.push(
        <div className="metaSection" key={i}>
          <h2 title={engLevelWording[i][1]}>
            Engagement level {i + 1} ({engLevelWording[i][0]}):
            <span onClick={() => openActAccordion("click", `eng${i}`)}>
              {actAccordion[`eng${i}`] ? CLOSE : OPEN}
            </span>{" "}
          </h2>
          <h2>count: {stakeholders.length}</h2>
          <div style={style}>
            <ul>{listLinks(stakeholders, setSelectedNode, cyState, setStakeholdersDisplay)} </ul>
          </div>
        </div>
      );
    }
  }
  const stakeholderCount = stakeholderCollection.flat().length;

  const style = (key) => ({ display: actAccordion[key] ? "block" : "none" });

  return (
    <div>
      <div className="metaSection">
        <h1>
          {meta.ID}. {meta[actFields.ACTIVITY]}
        </h1>
        <h1
          onClick={() => {
            !networkVeiw &&
              nodeNavigationHandler(selectedNode.parent, setSelectedNode, cyState, setStakeholdersDisplay);
          }}
          className="navigateToWp"
        >
          WP: {selectedNode.parent.slice(2)}
        </h1>
        <p style={completedStyle()} className="completed">
          {/* {meta["Activity Status"]} */}
          {completedText()}
        </p>
        {/* <h2>Flags:</h2>
        {flagText()} */}
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
        {/* <h2> PDCA Cycle: </h2> <p>{meta[actFields.PDCA]}</p> */}
        <h2> Contribution to DU: </h2> <p>{meta[actFields.PROJECTCONTRIBUTION]}</p>
      </div>
      <div className="metaSection">
        <h1>
          {/* DESCRIPTION{" "} */}
          Description:
          <span onClick={() => openActAccordion("click", "description")}>
            {actAccordion.description ? CLOSE : OPEN}
          </span>
        </h1>{" "}
        <p style={style("description")}>{meta[actFields.DESCRIPTION]}</p>
      </div>
      <div className="metaSection">
        <h1>
          {/* RESEARCH{" "} */}
          Research:
          <span onClick={() => openActAccordion("click", "research")}>{actAccordion.research ? CLOSE : OPEN}</span>{" "}
        </h1>
        <div style={style("research")}>
          <h2>Question Type:</h2> {researchQuestionType(meta)}
          <h2>Question:</h2> <p> {meta[actFields.QUESTION]} </p>
        </div>
      </div>
      <div className="metaSection">
        <h1>
          {/* METHODOLOGY{" "} */}
          Methodology
          <span onClick={() => openActAccordion("click", "method")}>{actAccordion.method ? CLOSE : OPEN}</span>
        </h1>
        <div style={style("method")}>
          <h2>Category:</h2> <p>{meta[actFields.CATEGORY]}</p>
          <h2>Methodology: </h2> <p>{meta[actFields.METHOD]} </p>
        </div>
      </div>
      <div className="metaSection">
        <h1>
          {/* DATA  */}
          Data
          <span onClick={() => openActAccordion("click", "data")}>{actAccordion.data ? CLOSE : OPEN}</span>{" "}
        </h1>
        <div style={style("data")}>
          <h2>Procurement Method: </h2> <p>{meta[actFields.DATAMETHOD]} </p>
          <h2>Type:</h2> <p>{meta[actFields.DATATYPE]}</p>
          <h2>Usage:</h2> <p>{meta[actFields.DATAUSAGE]}</p>
        </div>
      </div>
      <div className="metaSection">
        <h1>
          {/* DISCIPLINE{" "} */}
          Discipline
          <span onClick={() => openActAccordion("click", "discipline")}>
            {actAccordion.discipline ? CLOSE : OPEN}
          </span>{" "}
        </h1>
        <div style={style("discipline")}>
          <h2>Category: </h2> <p>{meta[actFields.CATEGORY]}</p>
          <h2>Specific Perspective:</h2> <p>{meta[actFields.PERSPECTIVES]}</p>
          <h2>Transdisciplinary Perspectives:</h2> <p>{meta[actFields.TDPERSPECTIVE]}</p>
        </div>
      </div>
      {/* <div className="metaSection">
        <h1>
          IERLAND WATER <span onClick={() => openActAccordion("click", "IW")}>{actAccordion.IW ? CLOSE : OPEN}</span>{" "}
        </h1>
        <div style={style("IW")}>
          <h2>Aims and Objectives: </h2> <p>{meta[actFields.IW]}</p>
          <h2>Contribution:</h2> <p>{meta[actFields.IWCONTRIBUTION]}</p>
        </div>
      </div> */}
      <div className="metaSection">
        <h1>
          {/* LINKED ACTIVITIES{" "} */}
          Linked Activities
          <span onClick={() => openActAccordion("click", "activity")}>{actAccordion.activity ? CLOSE : OPEN}</span>{" "}
        </h1>
        <h2>count: {uniqueActLinks.length}</h2>
        <ul style={style("activity")}>{linkedActivitiesList}</ul>
      </div>
      <div className="metaSection">
        <h1>
          {/* LINKED STAKEHOLDERS{" "} */}
          Linked External Stakeholders
          <span onClick={() => openActAccordion("click", "stakeholder")}>
            {actAccordion.stakeholder ? CLOSE : OPEN}
          </span>{" "}
        </h1>
        <h2>count: {stakeholderCount}</h2>
      </div>
      <div style={style("stakeholder")}>{stakeholderList}</div>
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

function listLinks(nodes, setSelectedNode, cyState, setStakeholdersDisplay) {
  return nodes.map((act) => (
    <li
      key={act.id()}
      onClick={() => nodeNavigationHandler(act.id(), setSelectedNode, cyState, setStakeholdersDisplay)}
      onMouseOver={() => hilightOnLiHover(act.id(), cyState)}
      onMouseOut={() => hilightOnLiHover(act.id(), cyState)}
    >
      {act.id()}. {act.data().name}
    </li>
  ));
}

// function flagText() {
//   if (selectedNode !== null) {
//     const allNodeEdges = cyState.cy.nodes('[type = "activityNode"]').map((node) => node.connectedEdges().length);
//     const meanEdges = allNodeEdges.reduce((a, b) => a + b, 0) / allNodeEdges.length; //gets average edges per node
//     const nodeEdges = cyState.cy.nodes(`[id = "${selectedNode.id}"]`).connectedEdges();
//     if (nodeEdges.length < meanEdges) {
//       return (
//         <p>
//           1. <span style={flagTextStyle}>Less than the mean number of connections</span>
//         </p>
//       );
//     } else {
//       return <p style={{ color: "green", opacity: "0.8" }}>none</p>;
//     }
//   }
// }

//  const flagTextStyle = {
//    color: "#FFBF00",
//    opacity: "0.7",
//  };
