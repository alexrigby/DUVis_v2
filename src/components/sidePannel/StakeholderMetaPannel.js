import nodeNavigationHandler from "./functions/nodeNavigationHandler";
import hilightOnLiHover from "./functions/hilightOnLiHover";

export function StakeholderMetaPannel({ selectedNode, setSelectedNode, cyState }) {
  const activityLists = [];

  //4 for 4 engagement levels
  for (var i = 0; i < 4; i++) {
    //get collections of conected nodes by engagemnet level
    const acts = cyState.cy
      .nodes(`[id = "${selectedNode.id}"]`)
      .outgoers(`[engagement = "${i + 1}"]`)
      .targets();

    //only push lists that have nodes
    if (acts.length !== 0) {
      activityLists.push(
        <div className="metaSection" key={i}>
          <h2>Level {i + 1} engagement: </h2>
          <ul>{listLinks(acts, setSelectedNode, cyState)} </ul>
        </div>
      );
    }
  }

  return (
    <div>
      <div className="metaSection">
        <h1>{selectedNode.name}</h1>
        <h1>{selectedNode.id}</h1>
      </div>
      <div>
        <h1>LINKED ACTIVITIES:</h1>
        {activityLists}
      </div>
    </div>
  );
}

export default StakeholderMetaPannel;

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
