import React, { useState, useEffect } from "react";
import CytoscapeComponent from "react-cytoscapejs";

import LAYOUTS from "../../configs/cyLayouts";
import stylesheet from "./stylesheet";
import nodeClickHandler from "./functions/nodeClickHandler";

export function Cytoscape({ cyState, setSelectedNode }) {
  //called every time setSideBarVis or cyState chanages

  useEffect(() => {
    cyState.cy.on("click", "node", (evt) => nodeClickHandler(setSelectedNode, cyState, evt));
    return () => cyState.cy.off("click", "node", (evt) => nodeClickHandler(setSelectedNode, cyState, evt)); //clean up click handler to prevent memory leak
  }, [setSelectedNode, cyState]);

  const style = { width: "100%", height: "100%", position: "absolute", display: "block", zIndex: -1 };

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
