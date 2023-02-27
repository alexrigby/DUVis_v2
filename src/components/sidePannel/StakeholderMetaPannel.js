import nodeNavigationHandler from "./functions/nodeNavigationHandler";
import hilightOnLiHover from "./functions/hilightOnLiHover";
import { useState } from "react";

import engLevelWording from "../../configs/engLevelWording";

export function StakeholderMetaPannel({ selectedNode, setSelectedNode, cyState, setStakeholdersDisplay }) {
  const open = <i className="fa fa-angle-down"></i>;
  const close = <i className="fa fa-angle-up"></i>;

  const engCount = Array.from(Array(engLevelWording.length).keys());
  const subSections = ["activity"]; // add or remove subsections

  const engObj = engCount.reduce((p, c) => ({ ...p, [`eng${c}`]: false }), {}); //adds each engement level to object {eng(n): false}
  const subSectionObj = subSections.reduce((p, c) => ({ ...p, [c]: false }), {}); // each subsection to object- false

  const [staAccordion, setStaAccordion] = useState({ ...engObj, ...subSectionObj });

  const openStaAccordion = (event, key) => {
    setStaAccordion((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const style = (key) => ({ display: staAccordion[key] ? "block" : "none" });

  const activityLists = [];
  const actCollection = [];

  //4 for 4 engagement levels
  for (let i = 0; i < engLevelWording.length; i++) {
    //get collections of conected nodes by engagemnet level
    const acts = cyState.cy
      .nodes(`[id = "${selectedNode.id}"]`)
      .outgoers(`[engagement = "${i + 1}"]`)
      .targets();

    actCollection.push(acts.flat());

    //only push lists that have nodes
    if (acts.length !== 0) {
      activityLists.push(
        <div className="metaSection" key={i}>
          <h2 title={engLevelWording[i][1]}>
            Engagement level {i + 1} ({engLevelWording[i][0]}):
            <span onClick={() => openStaAccordion("click", `eng${i}`)}>{staAccordion[`eng${i}`] ? close : open}</span>
          </h2>
          <h2>count: {acts.length}</h2>
          {/* <p>{engLevelWording[i][1]}</p> */}
          <div style={style(`eng${i}`)}>
            <ul>{listLinks(acts, setSelectedNode, cyState, setStakeholdersDisplay)} </ul>
          </div>
        </div>
      );
    }
  }

  const actCount = actCollection.flat().length;

  return (
    <div>
      <div className="metaSection">
        <h1>{selectedNode.name}</h1>
        <h1>{selectedNode.id}</h1>
        <h2>Sector: {selectedNode.sector}</h2>
        <h2>Category: {selectedNode.category}</h2>
      </div>

      <div className="metaSection">
        <h1>
          LINKED ACTIVITIES
          <span onClick={() => openStaAccordion("click", "activity")}>{staAccordion.activity ? close : open}</span>
        </h1>
        <h2>count: {actCount}</h2>
      </div>
      <div style={style("activity")}>{activityLists}</div>
    </div>
  );
}

export default StakeholderMetaPannel;

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
