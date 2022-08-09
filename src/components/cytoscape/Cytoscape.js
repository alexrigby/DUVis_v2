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

export function Cytoscape({ setSideBarVis }) {
  //sets state of cy
  const [cyState, setCyState] = useState({
    w: window.innerWidth,
    h: window.innerHeight,
    cy: null,
    elements: CytoscapeComponent.normalizeElements(data),
  });

  //sets initial state for clicked node
  const [clickedNode, setClickedNode] = useState("");

  //called every time setSideBarVis or cyState chanages
  useEffect(() => {
    const clickHandler = (event) => {
      var node = event.target;
      setClickedNode((prevState) => (node.id() === prevState ? "" : node.id())); // when new node is clicked sets clickedNode state too id of node, if same node clicked state set to ""
      setSideBarVis((prevState) => (node.id() === clickedNode || node.id() !== "" ? !prevState : prevState)); // if the same node is clicked (or node == "") then side bar closes, else keep the side bar open
    };
    cyState.cy.on("click", "node", clickHandler);
    return () => cyState.cy.off("click", "node", clickHandler);
  }, [setSideBarVis, cyState, setClickedNode, clickedNode]);

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
