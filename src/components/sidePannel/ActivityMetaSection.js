import nodeNavigationHandler from "./functions/nodeNavigationHandler";
import engLevelWording from "../../configs/engLevelWording";
import listLinks from "./functions/listLinks";
import capitalizeEachWord from "./functions/capitalizeEachWord";
import { actFields, INCLUDE_DATES } from "../../data";
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
  // -----------------------------USEFULL VARS------------------------------------------//
  const OPEN = <i className="fa fa-angle-down"></i>;
  const CLOSE = <i className="fa fa-angle-up"></i>;
  const ENG_COUNT = Array.from(Array(engLevelWording.length).keys());
  const SUBSECTIONS = [...actFields.META_FIELDS]; // array of user defined meta fileds to display
  const latestPrPeriod = INCLUDE_DATES && datesRef.current[datesRef.current.length - 1].prPeriod;

  //--------------------------------ACCORDION STATE----------------------------------------------------------------------------------------//
  const engObj = ENG_COUNT.reduce((p, c) => ({ ...p, [`eng${c}`]: false }), {}); //adds each engement level to object {eng(n): false}
  const subSectionObj = SUBSECTIONS.reduce((p, c) => ({ ...p, [c]: false }), {}); // each subsection to onject- false

  const [actAccordion, setActAccordion] = useState({ ...engObj, ...subSectionObj });

  const openActAccordion = (event, key) => {
    setActAccordion((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  //--------------------------------------------STYLE--------------------------------------------//
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
  //controls display state of slected accordion field
  const style = (key) => ({ display: actAccordion[key] ? "block" : "none" });

  const datesStyle = {
    opacity: 1,
    fontWeight: 550,
  };

  // --------------------------------------------PANNEL TEXT--------------------------------------------------//
  //--------------------DATES TEST--------------------
  const datesText = (
    <div>
      {" "}
      <p style={completedStyle()} className="completed">
        {completedText()}
      </p>
      <h2>Start - End:</h2>
      <p>
        <span style={datesStyle}> Date: </span> {shortDates(selectedNode, "start")} - {shortDates(selectedNode, "end")}
      </p>
      <p>
        <span style={datesStyle}> Months: </span> {selectedNode[actFields.STARTM]} - {selectedNode[actFields.ENDM]}
      </p>
      <p>
        <span style={datesStyle}> PR Period: </span> {selectedNode.startPrPeriod} -{" "}
        {selectedNode.endPrPeriod === "onGoing" ? "Ongoing" : selectedNode.endPrPeriod}
      </p>
    </div>
  );
  //----------------------USER DEFINED META FIELDS-----------------------
  //lopps over user defined meta sections and accessed the corresponding data from the dataset
  const metaSections = SUBSECTIONS.map((field, i) => {
    //capitalizing each word of fields
    var caps = capitalizeEachWord(field);

    return (
      <div className="metaSection" key={field}>
        <h1>
          {caps}: <span onClick={() => openActAccordion("click", field)}>{actAccordion[field] ? CLOSE : OPEN}</span>
        </h1>
        <p style={style(field)}>{selectedNode.meta[field]}</p>
      </div>
    );
  });

  //-------------------ACTIVITIES LIST------------------------
  const outgoingActivities = cyState.cy
    .nodes(`[id = "${selectedNode.id}"]`)
    .outgoers()
    .targets('[type != "stakeholderNode"]');

  const incommingActivities = cyState.cy
    .nodes(`[id = "${selectedNode.id}"]`)
    .incomers()
    .sources('[type != "stakeholderNode"]');

  const uniqueActLinks = [...new Set([...incommingActivities, ...outgoingActivities])]; // so same links arent displayed twice
  const linkedActivitiesList = listLinks(uniqueActLinks, setSelectedNode, cyState, setStakeholdersDisplay); // list of linked activites JSX

  //----------------STAKEHOLDERS LIST--------------
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

  return (
    <div>
      <div className="metaSection">
        <h1>{selectedNode.name}</h1>
        <h1
          onClick={() => {
            !networkVeiw &&
              nodeNavigationHandler(selectedNode.parent, setSelectedNode, cyState, setStakeholdersDisplay);
          }}
          className="navigateToWp"
        >
          {selectedNode.parent}
        </h1>
        {INCLUDE_DATES && datesText}
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
