import React, { useEffect } from "react";
import CytoscapeComponent from "react-cytoscapejs";

import LAYOUTS from "./functions/cyLayouts";
import stylesheet from "./functions/stylesheet";
import nodeTooltip from "./functions/nodeTooltips";
import styleSelectedElements from "./functions/styleSelectedElements";

export function CytoscapeVis({ cyState, setSelectedNode }) {
  //called every time setSideBarVis or cyState chanages
  useEffect(() => {
    nodeTooltip(cyState.cy); //produces tooltips on mouuseover
    const nodeClickHandler = (event) => {
      setSelectedNode((prevState) => (event.target.id() === prevState.id ? { id: "" } : event.target.data())); //if same node is clicked twice clear 'selected node' state
      styleSelectedElements(cyState.cy, event.target.id());
    };

    cyState.cy.on("click", "node", nodeClickHandler); //add event listner to node
    return () => cyState.cy.off("click", "node", nodeClickHandler); //clean up click handler to prevent memory leak
  }, [setSelectedNode, cyState]);

  const style = {
    display: cyState.display,
    // display: "none",
    width: "100%",
    height: "100%",
    position: "absolute",
  };

  return (
    <div>
      <CytoscapeComponent
        // cy prop allows acess to cy elements/functions
        cy={(cy) => {
          cyState.cy = cy;
        }}
        elements={cyState.elements}
        style={style}
        stylesheet={stylesheet}
        layout={LAYOUTS.COSE}
      />
    </div>
  );
}

export default CytoscapeVis;
