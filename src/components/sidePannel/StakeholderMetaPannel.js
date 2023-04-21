import { useState } from "react";
import { stFields } from "../../data";

import engLevelWording from "../../configs/engLevelWording";
import listLinks from "./functions/listLinks";
import capitalizeEachWord from "./functions/capitalizeEachWord";
export function StakeholderMetaPannel({ selectedNode, setSelectedNode, cyState, setStakeholdersDisplay }) {
  //--------------------------------------USEFULL VARIABLES -------------------------------//
  const OPEN = <i className="fa fa-angle-down"></i>;
  const CLOSE = <i className="fa fa-angle-up"></i>;
  const SUBSECTIONS = [...stFields.META_FIELDS];
  const ENG_COUNT = Array.from(Array(engLevelWording.length).keys()); // number of engagement levels

  //----------------------------------------------ACCORDION STATE----------------------------------//
  const engObj = ENG_COUNT.reduce((p, c) => ({ ...p, [`eng${c}`]: false }), {}); //adds each engement level to object {eng(n): false}
  const subSectionObj = SUBSECTIONS.reduce((p, c) => ({ ...p, [c]: false }), {});

  const [staAccordion, setStaAccordion] = useState({ ...engObj, ...subSectionObj }); // contains each section to be controled by accordion state

  const openStaAccordion = (event, key) => {
    setStaAccordion((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  //-----------------------------------------STYLE----------------------------------------//
  const style = (key) => ({ display: staAccordion[key] ? "block" : "none" });

  //-------------------------------------------META TEXT------------------------------------------//
  //---------USER DEFINED META FIELDS----------
  const metaSections = SUBSECTIONS.map((field, i) => {
    var caps = capitalizeEachWord(field);

    return (
      <div className="metaSection" key={field}>
        <h1>
          {caps}: <span onClick={() => openStaAccordion("click", field)}>{staAccordion[field] ? CLOSE : OPEN}</span>
        </h1>
        <p style={style(field)}>{selectedNode.meta[field]}</p>
      </div>
    );
  });

  //-----------------LINKED ACTIVITY PER ENGAGEMENT LEVEL---------------------
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
            <span onClick={() => openStaAccordion("click", `eng${i}`)}>{staAccordion[`eng${i}`] ? CLOSE : OPEN}</span>
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
      </div>
      <div>{metaSections}</div>

      <div className="metaSection">
        <h1>
          LINKED ACTIVITIES
          <span onClick={() => openStaAccordion("click", "activity")}>{staAccordion.activity ? CLOSE : OPEN}</span>
        </h1>
        <h2>count: {actCount}</h2>
      </div>
      <div style={style("activity")}>{activityLists}</div>
    </div>
  );
}

export default StakeholderMetaPannel;
