import nodeNavigationHandler from "./nodeNavigationHandler";
import hilightOnLiHover from "./hilightOnLiHover";

export function listLinks(nodes, setSelectedNode, cyState, setStakeholdersDisplay) {
  return nodes.map((act) => {
    return (
      <li
        key={act.id()}
        onClick={() => nodeNavigationHandler(act.id(), setSelectedNode, cyState, setStakeholdersDisplay)}
        onMouseOver={() => hilightOnLiHover(act.id(), cyState)}
        onMouseOut={() => hilightOnLiHover(act.id(), cyState)}
      >
        {act.data().displayName}
      </li>
    );
  });
}

export default listLinks;
