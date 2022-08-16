import styleActivitiesByWP from "../cytoscape/functions/styleActivitiesByWP";
import styleSelectedElements from "../cytoscape/functions/styleSelectedElements";

export function WpNodeMetaSection({ selectedNode, cyState, setSelectedNode }) {
  const wpActivities = cyState.cy.nodes(`[id = "${selectedNode.id}"]`).children();

  const activityClickHandler = (activity) => {
    console.log(cyState.cy.nodes(`[id = "${activity.id()}"]`).data());
    setSelectedNode(() => cyState.cy.nodes(`[id = "${activity.id()}"]`).data());
    styleSelectedElements(cyState.cy, activity);
  };

  const activitiesList = wpActivities.map((activity) => (
    <li key={activity.id()} onClick={() => activityClickHandler(activity)}>
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
