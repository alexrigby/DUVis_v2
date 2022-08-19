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
        <h1>{activitiesList.length}</h1>
        <ul>{activitiesList}</ul>
      </div>
    </div>
  );
}

export default WpNodeMetaSection;
