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
  const meta = selectedNode;
  const OPEN = <i className="fa fa-angle-down"></i>;
  const CLOSE = <i className="fa fa-angle-up"></i>;
  const ENG_COUNT = Array.from(Array(engLevelWording.length).keys());

  const SUBSECTIONS = [...actFields.META_FIELDS]; // array of user defined meta fileds to display

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
      if (selectedNode.endPrPeriod === "undefined" || selectedNode.endPrPeriod === "onGoing") {
        return { color: "#ffbf00", opacity: "1" };
      } else {
        return { color: selectedNode.endPrPeriod < latestPrPeriod ? "#1fc700" : "#ffbf00", opacity: "1" };
      }
    } else {
      if (selectedNode.endPrPeriod === "undefined" || selectedNode.endPrPeriod === "onGoing") {
        return { color: "#ffbf00", opacity: "1" };
      } else if (selectedNode.startPrPeriod > prPeriod.pr) {
        return { color: "#EE4B2B", fontSize: "15pt", fontWeight: "900", opacity: "1" };
      } else {
        return { color: selectedNode.endPrPeriod < prPeriod.pr ? "#1fc700" : "#ffbf00", opacity: "1" };
      }
    }
  }

  const datesStyle = {
    opacity: 1,
    fontWeight: 550,
  };

  function completedText() {
    if (prPeriod.pr === null) {
      if (selectedNode.endPrPeriod === "undefined" || selectedNode.endPrPeriod === "onGoing") {
        return "Ongoing";
      } else {
        return selectedNode.endPrPeriod < latestPrPeriod ? "Completed" : "Ongoing";
      }
    } else {
      if (selectedNode.endPrPeriod === "undefined" || selectedNode.endPrPeriod === "onGoing") {
        return "Ongoing";
      } else if (selectedNode.startPrPeriod > prPeriod.pr) {
        return "Not Started";
      } else {
        return selectedNode.endPrPeriod < prPeriod.pr ? "Completed" : "Ongoing";
      }
    }
  }

  const linkedActivitiesList = uniqueActLinks.map((act) => {
    //if no name is selcected generate name
    const actName = act.data().name ? `${act.id()}. ${act.data().name}` : `Activity ${act.data().id}`;

    return (
      <li
        key={act.id()}
        onClick={() => nodeNavigationHandler(act.id(), setSelectedNode, cyState, setStakeholdersDisplay)}
        onMouseOver={() => hilightOnLiHover(act.id(), cyState)}
        onMouseOut={() => hilightOnLiHover(act.id(), cyState)}
      >
        {actName}
      </li>
    );
  });

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

  //controls display state of slected accordion field
  const style = (key) => ({ display: actAccordion[key] ? "block" : "none" });

  //---------------------------------------------USER DEFINED META FIELDS-----------------------------------------------
  //lopps over user defined meta sections and accessed the corresponding data from the dataset
  const metaSections = SUBSECTIONS.map((sec, i) => {
    //sec = string key name of meta field
    //capitalizing each word of fields
    var secCopy = sec.slice();
    var capSecWords = secCopy.split(" ");
    capSecWords.forEach((word, i) => (capSecWords[i] = word[0].toUpperCase() + word.substring(1)));
    var capitalilized = capSecWords.join(" ");

    return (
      <div className="metaSection" key={sec}>
        <h1>
          {capitalilized}:{" "}
          <span onClick={() => openActAccordion("click", sec)}>{actAccordion[sec] ? CLOSE : OPEN}</span>
        </h1>
        <p style={style(sec)}>{selectedNode.meta[sec]}</p>
      </div>
    );
  });

  //if no name is provided return "Activity ID"
  const actName = selectedNode.name ? `${selectedNode.id}. ${selectedNode.name}` : `Activity ${selectedNode.id}`;

  return (
    <div>
      <div className="metaSection">
        <h1>{actName}</h1>
        <h1
          onClick={() => {
            !networkVeiw &&
              nodeNavigationHandler(selectedNode.parent, setSelectedNode, cyState, setStakeholdersDisplay);
          }}
          className="navigateToWp"
        >
          WP: {cyState.cy.nodes(`#${selectedNode.id}`).parent().data().label}
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
      </div>
      <div>{metaSections}</div>
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
  nodes.map((act) => {
    return (
      <li
        key={act.id()}
        onClick={() => nodeNavigationHandler(act.id(), setSelectedNode, cyState, setStakeholdersDisplay)}
        onMouseOver={() => hilightOnLiHover(act.id(), cyState)}
        onMouseOut={() => hilightOnLiHover(act.id(), cyState)}
      >
        {act.id()}. ${act.data().name}
      </li>
    );
  });
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
