import React, { useState, useEffect } from "react";
import CytoscapeComponent from "react-cytoscapejs";

const data = {
  nodes: [
    { data: { id: "1", label: "Node 1" }, position: { x: 0, y: 0 } },
    { data: { id: "2", label: "Node 2" }, position: { x: 100, y: 0 } },
  ],
  edges: [
    {
      data: { source: "1", target: "2", label: "Edge from Node1 to Node2" },
    },
  ],
};

export function Cytoscape({ setselectedNode }) {
  //sets state of cy
  const [cyState, setCyState] = useState({
    w: window.innerWidth,
    h: window.innerHeight,
    cy: null,
    elements: CytoscapeComponent.normalizeElements(data),
  });

  //called every time setSideBarVis or cyState chanages
  useEffect(() => {
    const clickHandler = (event) => {
      setselectedNode((prevState) => (event.target.id() === prevState.id ? { id: "" } : event.target.data())); // when new node is clicked sets selectedNode state too id of node, if same node clicked state set to ""
    };
    cyState.cy.on("click", "node", clickHandler);
    return () => cyState.cy.off("click", "node", clickHandler);
  }, [setselectedNode, cyState]);

  const style = { width: cyState.w, height: cyState.h };

  return (
    <div>
      <CytoscapeComponent
        // cy prop allows acess to cy elements/functions
        cy={(cy) => {
          cyState.cy = cy;
        }}
        elements={cyState.elements}
        style={style}
      />
    </div>
  );
}

export default Cytoscape;
