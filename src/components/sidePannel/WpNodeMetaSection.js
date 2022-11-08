import { useEffect, useState, useRef } from "react";

import styleActivitiesByWP from "../cytoscape/functions/styleActivitiesByWP";
import nodeNavigationHandler from "./functions/nodeNavigationHandler";
import hilightOnLiHover from "./functions/hilightOnLiHover";

export function WpNodeMetaSection({ selectedNode, cyState, setSelectedNode }) {
  const [accordion, setAccordion] = useState({ activity: false, stakeholder: false });
  const stakeholderCountRef = useRef(null);
  const wpStakeholderListRef = useRef(null);

  const wpActivities = cyState.cy.nodes(`[id = "${selectedNode.id}"]`).children();

  const activitiesList = listLinks(wpActivities, setSelectedNode, cyState);

  useEffect(() => {
    const wpStakeholdersList = [];
    const wpStakeholders = [];
    for (let i = 0; i < 4; i++) {
      const stakeholderList = [];
      //loop over alll wp activities and return there connected stakeholders by engement (1-4)
      for (let j = 0; j < wpActivities.length; j++) {
        const stakeholders = wpActivities[j]
          .incomers(`[engagement = "${i + 1}"]`)
          .sources('[type = "stakeholderNode"]');
        if (stakeholders.length !== 0) {
          stakeholderList.push(stakeholders.flat());
        }
      }
      // remove any duplicate stakeholders
      const uniqueStakeholders = [...new Set([...stakeholderList.flat()])];
      //add stakeholders to a lists by engement level
      if (uniqueStakeholders.length !== 0) {
        const key = `eng${i}`;
        wpStakeholders.push(uniqueStakeholders);

        setAccordion((prevState) => ({
          ...prevState,
          [key]: false,
        }));

        // var f = (event) => {
        //   setAccordion((prevState) => ({
        //     ...prevState,
        //     [key]: !prevState[key]
        //   }))
        // };
        // Object.defineProperty(f, 'name', {value: key})

        wpStakeholdersList.push(
          <div className="metaSection" key={i}>
            <h2>
              Level {i + 1} engagement:{" "}
              <span
                onClick={() => {
                  setAccordion((prevState) => ({
                    ...prevState,
                    [key]: !prevState[key],
                  }));
                }}
              >
                {accordion[key] ? <i className="fa fa-angle-up"></i> : <i className="fa fa-angle-down"></i>}
              </span>
            </h2>
            <h2>count: {uniqueStakeholders.length}</h2>
            <div style={{ display: accordion[key] ? "none" : "block" }}>
              <ul>{listLinks(uniqueStakeholders, setSelectedNode, cyState)} </ul>
            </div>
          </div>
        );
      }
    }

    stakeholderCountRef.current = wpStakeholders.flat().length;
    wpStakeholderListRef.current = wpStakeholdersList;
  }, []);

  //TO DO --- ontrol stakeholder headers with display instead of this ^^^^^^

  const openActivitySection = (event) => {
    setAccordion((prevState) => ({
      ...prevState,
      activity: !prevState.activity,
    }));
  };

  const openStakeholderSection = (event) => {
    setAccordion((prevState) => ({
      ...prevState,
      stakeholder: !prevState.stakeholder,
    }));
  };

  console.log(accordion);
  const acivitiesListStyle = {
    display: !accordion.activity ? "none" : "block",
  };

  const stakeholderListDisplay = {
    display: !accordion.stakeholder ? "none" : "block",
  };

  return (
    <div>
      <div className="metaSection">
        <h1 style={styleActivitiesByWP(selectedNode.id)}>WP: {selectedNode.id.slice(2)}</h1>
        <h1>{selectedNode.name}</h1>
        <h2>Category:</h2>
        <p>{selectedNode.category}</p>
      </div>
      <div className="metaSection">
        <div className="metaSectionHead">
          <h1>
            ACTIVITIES{" "}
            <span onClick={openActivitySection}>
              {accordion.activity ? <i className="fa fa-angle-up"></i> : <i className="fa fa-angle-down"></i>}
            </span>
          </h1>
        </div>
        <h2>count: {activitiesList.length}</h2>
        <ul style={acivitiesListStyle}>{activitiesList}</ul>
      </div>
      <div className="metaSection">
        <div className="metaSectionHead">
          <h1>
            LINKED STAKEHOLDERS{" "}
            <span onClick={openStakeholderSection}>
              {accordion.stakeholder ? <i className="fa fa-angle-up"></i> : <i className="fa fa-angle-down"></i>}
            </span>
          </h1>
          <h2>count: {stakeholderCountRef.current}</h2>
        </div>
        <div style={stakeholderListDisplay}>{wpStakeholderListRef.current}</div>
      </div>
    </div>
  );
}

export default WpNodeMetaSection;

function listLinks(nodes, setSelectedNode, cyState) {
  return nodes.map((act) => (
    <li
      key={act.id()}
      onClick={() => nodeNavigationHandler(act.id(), setSelectedNode, cyState)}
      onMouseOver={() => hilightOnLiHover(act.id(), cyState)}
      onMouseOut={() => hilightOnLiHover(act.id(), cyState)}
    >
      {act.id()}. {act.data().name}
    </li>
  ));
}
