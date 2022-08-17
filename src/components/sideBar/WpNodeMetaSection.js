import styleActivitiesByWP from "../cytoscape/functions/styleActivitiesByWP";
import nodeNavigationHandler from "./functions/nodeNavigationHandler";

export function WpNodeMetaSection({ selectedNode, cyState, setSelectedNode }) {
  const wpActivities = cyState.cy.nodes(`[id = "${selectedNode.id}"]`).children();

  const hilightNodeOnLiHover = (activityId) => {
    cyState.cy.nodes(`[id = "${activityId}"]`).toggleClass("selectedNode");
  };

  const activitiesList = wpActivities.map((activity) => (
    <li
      key={activity.id()}
      onClick={() => nodeNavigationHandler(activity.id(), setSelectedNode, cyState)}
      onMouseOver={() => hilightNodeOnLiHover(activity.id())}
      onMouseOut={() => hilightNodeOnLiHover(activity.id())}
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
