import styleActivitiesByWP from "../cytoscape/functions/styleActivitiesByWP";
import nodeNavigationHandler from "./functions/nodeNavigationHandler";
import hilightOnLiHover from "./functions/hilightOnLiHover";

export function WpNodeMetaSection({ selectedNode, cyState, setSelectedNode }) {
  const wpActivities = cyState.cy.nodes(`[id = "${selectedNode.id}"]`).children();

  const activitiesList = wpActivities.map((activity) => (
    <li
      key={activity.id()}
      onClick={() => nodeNavigationHandler(activity.id(), setSelectedNode, cyState)}
      onMouseOver={() => hilightOnLiHover(activity.id(), cyState)}
      onMouseOut={() => hilightOnLiHover(activity.id(), cyState)}
    >
      {activity.id()}. {activity.data().name}
    </li>
  ));

  const wpStakeholders = [];
  for (let i = 0; i < 4; i++) {
    const stakeholderList = [];
    //loop over alll wp activities and return there connected stakeholders by engement (1-4)
    for (let j = 0; j < wpActivities.length; j++) {
      const stakeholders = wpActivities[j].incomers(`[engagement = "${i + 1}"]`).sources('[type = "stakeholderNode"]');
      if (stakeholders.length !== 0) {
        stakeholderList.push(stakeholders.flat());
      }
    }
    // remove any duplicate stakeholders
    const uniqueStakeholders = [...new Set([...stakeholderList.flat()])];
    //add stakeholders to a lists by engement level
    if (uniqueStakeholders.length !== 0) {
      wpStakeholders.push(
        <div className="metaSection" key={i}>
          <h2>Level {i + 1} engagement: </h2>
          <h2>count: {uniqueStakeholders.length}</h2>
          <ul>{listLinks(uniqueStakeholders, setSelectedNode, cyState)} </ul>
        </div>
      );
    }
  }

  return (
    <div>
      <div className="metaSection">
        <h1 style={styleActivitiesByWP(selectedNode.id)}>WP: {selectedNode.id.slice(2)}</h1>
        <h1>{selectedNode.name}</h1>
        <h2>Category:</h2>
        <p>{selectedNode.category}</p>
      </div>
      <div className="metaSection">
        <h1>ACTIVITIES: </h1>
        <h2>count: {activitiesList.length}</h2>
        <ul>{activitiesList}</ul>
      </div>
      <div className="metaSection">
        <h1>LINKED STAKEHOLDERS: </h1>
        {wpStakeholders}
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
