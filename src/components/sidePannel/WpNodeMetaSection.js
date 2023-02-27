import { useState } from "react";
import { BG } from "../../configs/COLORS";
import SDG_ICONS from "../../assets/sdg_icons/index";
import engLevelWording from "../../configs/engLevelWording";

import nodeNavigationHandler from "./functions/nodeNavigationHandler";
import hilightOnLiHover from "./functions/hilightOnLiHover";

export function WpNodeMetaSection({ selectedNode, cyState, setSelectedNode, setStakeholdersDisplay }) {
  const open = <i className="fa fa-angle-down"></i>;
  const close = <i className="fa fa-angle-up"></i>;

  const engCount = Array.from(Array(engLevelWording.length).keys()); // add or remove numbers if engement level chnages
  const subSections = ["activity", "stakeholder", "SDGs"]; // add or remove subsections

  const engObj = engCount.reduce((p, c) => ({ ...p, [`eng${c}`]: false }), {}); //adds each engement level to object {eng(n): false}
  const subSectionObj = subSections.reduce((p, c) => ({ ...p, [c]: false }), {}); // each subsection to onject- false

  const [wpAccordion, setWPAccordion] = useState({ ...subSectionObj, ...engObj }); //add all sunsections to state

  const wpActivities = cyState.cy.nodes(`[id = "${selectedNode.id}"]`).children(); //gets all activities in wp

  const activitiesList = listLinks(wpActivities, setSelectedNode, cyState, setStakeholdersDisplay); // makes list of acctivitis

  const wpStakeholdersList = []; // JSX list of stakeholders and headings
  const wpStakeholders = []; // list of all stakehlders (to get total count)

  const openAccordion = (event, key) => {
    setWPAccordion((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  //loop over once for every level of engagemnt
  for (let i = 0; i < engCount.length; i++) {
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
            <span onClick={() => openAccordion("click", `eng${i}`)}>{wpAccordion[`eng${i}`] ? close : open}</span>
          </h2>
          <h2>count: {uniqueStakeholders.length}</h2>
          <div style={style}>
            <ul>{listLinks(uniqueStakeholders, setSelectedNode, cyState, setStakeholdersDisplay)} </ul>
          </div>
        </div>
      );
    }
  }

  const sdgIconStyle = { width: "92px", height: "92px", paddingRight: "4px" };

  const sdgList = selectedNode.SDGs.map((sdg) => (
    <a href={`${SDG_ICONS[sdg].link}`} key={sdg} to="route" target="_blank" rel="noopener noreferrer">
      <img
        src={SDG_ICONS[sdg].icon}
        alt={`${SDG_ICONS[sdg].description}`}
        title={`${SDG_ICONS[sdg].description}`}
        style={sdgIconStyle}
      />
    </a>
  ));

  const stakeholderCount = wpStakeholders.flat().length;

  const acivitiesListStyle = {
    display: !wpAccordion.activity ? "none" : "block",
  };

  const sdgListStyle = {
    display: !wpAccordion.SDGs ? "none" : "block",
  };

  const stakeholderListDisplay = {
    display: !wpAccordion.stakeholder ? "none" : "block",
  };

  return (
    <div>
      <div className="metaSection">
        <h1 style={{ backgroundColor: BG[selectedNode.id] }}>WP: {selectedNode.id.slice(2)}</h1>
        <h1>{selectedNode.name}</h1>
        <h2>Category:</h2>
        <p>{selectedNode.category}</p>
      </div>
      <div className="metaSection">
        <div className="metaSectionHead">
          <h1>
            UN SDGs: <span onClick={() => openAccordion("click", "SDGs")}>{wpAccordion.SDGs ? close : open} </span>
          </h1>
        </div>
        <div style={sdgListStyle}>{sdgList}</div>
      </div>
      <div className="metaSection">
        <div className="metaSectionHead">
          <h1>
            ACTIVITIES{" "}
            <span onClick={() => openAccordion("click", "activity")}>{wpAccordion.activity ? close : open}</span>
          </h1>
        </div>
        <h2>count: {activitiesList.length}</h2>
        <ul style={acivitiesListStyle}>{activitiesList}</ul>
      </div>
      <div className="metaSectionHead metaSection">
        <h1>
          LINKED STAKEHOLDERS{" "}
          <span onClick={() => openAccordion("click", "stakeholder")}>{wpAccordion.stakeholder ? close : open}</span>
        </h1>
        <h2>count: {stakeholderCount}</h2>
      </div>
      <div style={stakeholderListDisplay}>{wpStakeholdersList}</div>
    </div>
  );
}

export default WpNodeMetaSection;

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

//   <div className="metaSection">
//     <h2>
//       Level 1 engagement:
//       <span>{/* {accordion? <i className="fa fa-angle-up"></i> : <i className="fa fa-angle-down"></i>} */}</span>
//     </h2>
//     <h2>count: {wpStakeholders[0].length}</h2>
//     {wpStakeholdersList[0]}
//   </div>
//   <div className="metaSection">
//     <h2>
//       Level 2 engagement:
//       <span>{/* {accordion? <i className="fa fa-angle-up"></i> : <i className="fa fa-angle-down"></i>} */}</span>
//     </h2>
//     <h2>count: {wpStakeholders[1].length}</h2>
//     {wpStakeholdersList[1]}
//   </div>
//   <div className="metaSection">
//     <h2>
//       Level 3 engagement:
//       <span>{/* {accordion? <i className="fa fa-angle-up"></i> : <i className="fa fa-angle-down"></i>} */}</span>
//     </h2>
//     <h2>count: {wpStakeholders[2].length}</h2>
//     {wpStakeholdersList[2]}
//   </div>
//   <div className="metaSection">
//     <h2>
//       Level 4 engagement:
//       <span>{/* {accordion? <i className="fa fa-angle-up"></i> : <i className="fa fa-angle-down"></i>} */}</span>
//     </h2>
//     <h2>count: {wpStakeholders[3].length}</h2>
//     {wpStakeholdersList[3]}
//   </div>
//   {/* <div style={stakeholderListDisplay}>{wpStakeholdersList}</div> */}
// </div>
