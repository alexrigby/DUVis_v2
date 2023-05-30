import { useState, useContext } from "react";

import ConfigContext from "../../context/ConfigContext";
import engLevelWording from "../../configs/engLevelWording";
import listLinks from "./functions/listLinks";
import capitalizeEachWord from "./functions/capitalizeEachWord";
import getTypeOptionsArray from "../../AppFunctions/getTypeOptionsArray";
import makeSDGList from "./functions/makeSDGList";

export function WpNodeMetaSection({ selectedNode, cyState, setSelectedNode, setStakeholdersDisplay }) {
  //-------------CONFIG----------------
  const { config } = useContext(ConfigContext);
  const INCLUDE_STHOLDERS = config.INCLUDE_STHOLDERS;
  const wpFields = config.wpFields;
  const actFields = config.actFields;

  // --------------------------------------USEFULL VARS---------------------------------------------------//
  const OPEN = <i className="fa fa-angle-down"></i>;
  const CLOSE = <i className="fa fa-angle-up"></i>;
  const ENG_COUNT = Array.from(Array(engLevelWording.length).keys());
  const CATEGORICAL_SUBSECTIONS = getTypeOptionsArray(wpFields.META_FIELDS, "category");
  const TEXT_SUBSECTIONS = getTypeOptionsArray(wpFields.META_FIELDS, "text");
  const wpActivities = cyState.cy.nodes(`[id = "${selectedNode.id}"]`).children(); //gets all activities in wp

  //-------------------------------------ACCORDION STATE---------------------------------------------------//
  const engObj = ENG_COUNT.reduce((p, c) => ({ ...p, [`eng${c}`]: false }), {}); //adds each engement level to object {eng(n): false}
  const subSectionObj = TEXT_SUBSECTIONS.reduce((p, c) => ({ ...p, [c]: false }), {}); // each subsection to onject- false
  const sdgSectionObj = { SDGs: false };

  const [wpAccordion, setWPAccordion] = useState({ sdgSectionObj, ...subSectionObj, ...engObj }); //add all sunsections to state

  const openAccordion = (event, key) => {
    setWPAccordion((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  // -----------------------------------------------STYLE--------------------------------------------//
  const style = (key) => ({ display: wpAccordion[key] ? "block" : "none" });

  //------------------------------PANNEL TEXT-----------------------------------------------------//
  //----------------USER DEFINED CATEGORICAL META FIELDS----------

  const categoricalMetaSection = CATEGORICAL_SUBSECTIONS.length > 0 && (
    <div className="metaSection">
      {CATEGORICAL_SUBSECTIONS.map((field, i) => {
        var caps = capitalizeEachWord(field);

        return (
          <div key={field}>
            <h2 style={{ display: "inline" }}>
              {caps}:{"  "}
            </h2>
            <p style={{ display: "inline" }}>{selectedNode.meta[field] ? selectedNode.meta[field] : "Undefined"}</p>
          </div>
        );
      })}
    </div>
  );

  //-----------------SDGS FROM CHILDREN NODES--------------------------
  //unique array of all sdgs contined by wp chilldren nodes also handles if none are defined
  const sdgList = [
    ...new Set(
      wpActivities
        .filter((act) => act.data("SDGs")) // filter acts with no sdgs
        .reduce((a, b) => {
          return [...a, ...b.data("SDGs")];
        }, [])
    ),
  ];

  const sdgIcons = sdgList.length > 0 && (
    <div className="metaSection">
      <h1>
        {actFields.SDGs}
        <span onClick={() => openAccordion("click", "SDGs")}>{wpAccordion["SDGs"] ? CLOSE : OPEN} </span>
      </h1>
      <div style={style("SDGs")}>{makeSDGList(sdgList)}</div>
    </div>
  );
  //-------------------USER DEFINED TEXT META FIELDS TO AD TO ACCORDION------------------

  const textMetaSections =
    TEXT_SUBSECTIONS.length > 0 &&
    TEXT_SUBSECTIONS.map((field, i) => {
      var caps = capitalizeEachWord(field);

      return (
        <div className="metaSection" key={field}>
          <h1>
            {caps}: <span onClick={() => openAccordion("click", field)}>{wpAccordion[field] ? CLOSE : OPEN}</span>
          </h1>
          <p style={style(field)}>{selectedNode.meta[field] ? selectedNode.meta[field] : "Undefined"}</p>
        </div>
      );
    });

  //--------------------ACTIVITIES LIST ----------------------

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

  return (
    <div>
      <div className="metaSection">
        <h1 style={{ backgroundColor: selectedNode.bgColor }}>WP: {selectedNode.label}</h1>
        <h1>{selectedNode.name}</h1>
      </div>
      <div>{categoricalMetaSection}</div>
      <div>{sdgIcons}</div>
      <div>{textMetaSections}</div>
      <div className="metaSection">
        <div className="metaSectionHead">
          <h1>
            Activities
            <span onClick={() => openAccordion("click", "activity")}>{wpAccordion.activity ? CLOSE : OPEN}</span>
          </h1>
        </div>
        <h2>count: {activitiesList.length}</h2>
        <ul style={style("activity")}>{activitiesList}</ul>
      </div>
      {INCLUDE_STHOLDERS && (
        <div className="metaSectionHead metaSection">
          <h1>
            Stakeholders
            <span onClick={() => openAccordion("click", "stakeholder")}>{wpAccordion.stakeholder ? CLOSE : OPEN}</span>
          </h1>
          <h2>count: {stakeholderCount}</h2>
        </div>
      )}
      {INCLUDE_STHOLDERS && <div style={style("stakeholder")}>{wpStakeholdersList}</div>}
    </div>
  );
}

export default WpNodeMetaSection;
