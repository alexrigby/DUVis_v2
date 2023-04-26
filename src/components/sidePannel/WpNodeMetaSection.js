import { useState } from "react";
import SDG_ICONS from "../../assets/sdg_icons/index";
import engLevelWording from "../../configs/engLevelWording";
import listLinks from "./functions/listLinks";
import capitalizeEachWord from "./functions/capitalizeEachWord";
import getTypeOptionsArray from "../../AppFunctions/getTypeOptionsArray";

import { wpFields, projectMeta } from "../../data";

export function WpNodeMetaSection({ selectedNode, cyState, setSelectedNode, setStakeholdersDisplay }) {
  // --------------------------------------USEFULL VARS---------------------------------------------------//
  const OPEN = <i className="fa fa-angle-down"></i>;
  const CLOSE = <i className="fa fa-angle-up"></i>;
  const ENG_COUNT = Array.from(Array(engLevelWording.length).keys());
  const CATEGORICAL_SUBSECTIONS = getTypeOptionsArray(wpFields.META_FIELDS, "categorical");
  const TEXT_SUBSECTIONS = getTypeOptionsArray(wpFields.META_FIELDS, "text");
  const includeStakeholders = projectMeta.STHOLDERS;

  //-------------------------------------ACCORDION STATE---------------------------------------------------//
  const engObj = ENG_COUNT.reduce((p, c) => ({ ...p, [`eng${c}`]: false }), {}); //adds each engement level to object {eng(n): false}
  const subSectionObj = TEXT_SUBSECTIONS.reduce((p, c) => ({ ...p, [c]: false }), {}); // each subsection to onject- false

  const [wpAccordion, setWPAccordion] = useState({ ...subSectionObj, ...engObj }); //add all sunsections to state

  const openAccordion = (event, key) => {
    setWPAccordion((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const style = (key) => ({ display: wpAccordion[key] ? "block" : "none" });
  //------------------------------PANNEL TEXT-----------------------------------------------------//
  //----------------USER DEFINED CATEGORICAL META FIELDS----------
  const categoricalMetaSection = CATEGORICAL_SUBSECTIONS.map((field, i) => {
    var caps = capitalizeEachWord(field);

    return (
      <div key={field}>
        <h2 style={{ display: "inline" }}>
          {caps}:{"  "}
        </h2>
        <p style={{ display: "inline" }}>{selectedNode.meta[field]}</p>
      </div>
    );
  });

  //-------------------USER DEFINED TEXT META FIELDS TO AD TO ACCORDION------------------

  const textMetaSections = TEXT_SUBSECTIONS.map((field, i) => {
    var caps = capitalizeEachWord(field);

    return (
      <div className="metaSection" key={field}>
        <h1>
          {caps}: <span onClick={() => openAccordion("click", field)}>{wpAccordion[field] ? CLOSE : OPEN}</span>
        </h1>
        <p style={style(field)}>{selectedNode.meta[field]}</p>
      </div>
    );
  });

  //--------------------ACTIVITIES LIST ----------------------
  const wpActivities = cyState.cy.nodes(`[id = "${selectedNode.id}"]`).children(); //gets all activities in wp
  const activitiesList = listLinks(wpActivities, setSelectedNode, cyState, setStakeholdersDisplay); // makes JSX list of acctivitis

  //---------------- STAKEHOLDER LIST-----------------
  const wpStakeholdersList = []; // JSX list of stakeholders and headings
  const wpStakeholders = []; // list of all stakehlders (to get total count)

  //loop over once for every level of engagemnt
  for (let i = 0; i < ENG_COUNT.length; i++) {
    const stakeholderList = [];
    //loop over alll wp activities and return there connected stakeholders by engement (1-4)
    for (let j = 0; j < wpActivities.length; j++) {
      const stakeholders = wpActivities[j].incomers(`[engagement = "${i + 1}"]`).sources('[type = "stakeholderNode"]');
      if (stakeholders.length !== 0) {
        stakeholderList.push(stakeholders.flat());
      }
    }
    const uniqueStakeholders = [...new Set([...stakeholderList.flat()])]; // remove any duplicate stakeholders
    //add stakeholders to a lists by engement level
    if (uniqueStakeholders.length !== 0) {
      wpStakeholders.push(uniqueStakeholders); // to get total count

      const style = {
        // style by state for eng(n)
        display: wpAccordion[`eng${i}`] ? "block" : "none",
      };

      wpStakeholdersList.push(
        <div className="metaSection" key={i}>
          <h2 title={engLevelWording[i][1]}>
            Engagement level {i + 1} ({engLevelWording[i][0]}):
            <span onClick={() => openAccordion("click", `eng${i}`)}>{wpAccordion[`eng${i}`] ? CLOSE : OPEN}</span>
          </h2>
          <h2>count: {uniqueStakeholders.length}</h2>
          <div style={style}>
            <ul>{listLinks(uniqueStakeholders, setSelectedNode, cyState, setStakeholdersDisplay)} </ul>
          </div>
        </div>
      );
    }
  }

  const stakeholderCount = wpStakeholders.flat().length;

  //--------------------------SDGS------------------ (maybe remove to generalise)
  // const sdgIconStyle = { width: "92px", height: "92px", paddingRight: "4px" };

  // const sdgList = selectedNode.SDGs.map((sdg) => (
  //   <a href={`${SDG_ICONS[sdg].link}`} key={sdg} to="route" target="_blank" rel="noopener noreferrer">
  //     <img
  //       src={SDG_ICONS[sdg].icon}
  //       alt={`${SDG_ICONS[sdg].description}`}
  //       title={`${SDG_ICONS[sdg].description}`}
  //       style={sdgIconStyle}
  //     />
  //   </a>
  // ));

  // -----------------------------------------------STYLE--------------------------------------------//
  const acivitiesListStyle = {
    display: !wpAccordion.activity ? "none" : "block",
  };

  const stakeholderListDisplay = {
    display: !wpAccordion.stakeholder ? "none" : "block",
  };

  // const sdgListStyle = {
  //   display: !wpAccordion.SDGs ? "none" : "block",
  // };

  return (
    <div>
      <div className="metaSection">
        <h1 style={{ backgroundColor: selectedNode.bgColor }}>WP: {selectedNode.label}</h1>
        <h1>{selectedNode.name}</h1>
      </div>
      <div className="metaSection">{categoricalMetaSection}</div>
      <div>{textMetaSections}</div>
      {/* <div className="metaSection">
        <div className="metaSectionHead">
          <h1>
            UN SDGs: <span onClick={() => openAccordion("click", "SDGs")}>{wpAccordion.SDGs ? close : open} </span>
          </h1>
        </div>
        <div style={sdgListStyle}>{sdgList}</div>
      </div> */}
      <div className="metaSection">
        <div className="metaSectionHead">
          <h1>
            ACTIVITIES{" "}
            <span onClick={() => openAccordion("click", "activity")}>{wpAccordion.activity ? CLOSE : OPEN}</span>
          </h1>
        </div>
        <h2>count: {activitiesList.length}</h2>
        <ul style={acivitiesListStyle}>{activitiesList}</ul>
      </div>
      {includeStakeholders && (
        <div className="metaSectionHead metaSection">
          <h1>
            LINKED STAKEHOLDERS{" "}
            <span onClick={() => openAccordion("click", "stakeholder")}>{wpAccordion.stakeholder ? CLOSE : OPEN}</span>
          </h1>
          <h2>count: {stakeholderCount}</h2>
        </div>
      )}
      {includeStakeholders && <div style={stakeholderListDisplay}>{wpStakeholdersList}</div>}
    </div>
  );
}

export default WpNodeMetaSection;
