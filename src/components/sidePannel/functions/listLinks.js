import nodeNavigationHandler from "./nodeNavigationHandler";
import hilightOnLiHover from "./hilightOnLiHover";

export function listLinks(nodes, setSelectedNode, cyState, setStakeholdersDisplay) {
  return nodes.map((act) => {
    //if no name is specifiedby uuser in the excel then  generate name
    const actName = act.data().name ? `${act.id()}. ${act.data().name}` : `Activity ${act.data().id}`;
    return (
      <li
        key={act.id()}
        onClick={() => nodeNavigationHandler(act.id(), setSelectedNode, cyState, setStakeholdersDisplay)}
        onMouseOver={() => hilightOnLiHover(act.id(), cyState)}
        onMouseOut={() => hilightOnLiHover(act.id(), cyState)}
      >
        {actName}
      </li>
    );
  });
}

export default listLinks;
