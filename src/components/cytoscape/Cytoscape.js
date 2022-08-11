import React, { useState, useEffect } from "react";
import CytoscapeComponent from "react-cytoscapejs";

import LAYOUTS from "./functions/cyLayouts";
import stylesheet from "./stylesheet";

export function Cytoscape({ cyState, setSelectedNode }) {
  //called every time setSideBarVis or cyState chanages

  useEffect(() => {
    const nodeClickHandler = (event) => {
      setSelectedNode((prevState) => (event.target.id() === prevState.id ? { id: "" } : event.target.data())); //if same node is clicked twice clear 'selected node' state
      cyState.cy.edges().removeClass("connectedEdge"); //sets all edges back to default
      cyState.cy.nodes(`[id = "${event.target.id()}"]`).connectedEdges("edge").addClass("connectedEdge"); //adds class to edges connected to clicked node
    };

    cyState.cy.on("click", "node[type != 'wp']", nodeClickHandler); //add event listner to node
    return () => cyState.cy.off("click", "node[type != 'wp']", nodeClickHandler); //clean up click handler to prevent memory leak
  }, [setSelectedNode, cyState]);

  const style = {
    display: cyState.display,
    width: "100%",
    height: "100%",
    position: "absolute",
    zIndex: -1,
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

export default Cytoscape;

// useEffect(() => {
//   function resizeCy() {
//     setCyState((prevState) => ({
//       ...prevState,
//       h: window.innerHeight,
//       w: window.innerWidth,
//     }));
//   }

//   window.addEventListener("resize", resizeCy);
//   return function () {
//     window.removeEventListener("resize", resizeCy);
//   };
// }, [setCyState]);
