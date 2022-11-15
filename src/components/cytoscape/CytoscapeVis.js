import React, { useEffect } from "react";
import CytoscapeComponent from "react-cytoscapejs";

import LAYOUTS from "./functions/cyLayouts";
import stylesheet from "./functions/stylesheet";
import nodeTooltip from "./functions/nodeTooltips";
import styleSelectedElements from "./functions/styleSelectedElements";

export function CytoscapeVis({
  cyState,
  setSelectedNode,
  activityEdgeDisplay,
  stakeholdersDisplay,
  nodeCountRef,
  totalActCountRef,
  networkVeiw,
}) {
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

  useEffect(() => {
    //only runs when the elements length chnages--- hakey but works
    nodeCountRef.current &&
      totalActCountRef.current &&
      cyState.cy
        .elements("[type != 'network']")
        .layout(LAYOUTS(nodeCountRef.current, totalActCountRef.current, false).FCOSE)
        .run();
    cyState.cy.fit();
  }, [cyState.cy, cyState.elements.length, nodeCountRef, totalActCountRef]);

  const testNode = 1;

  const LAYOUT_T = {
    name: "concentric",
  };

  function networkLayout() {
    const nHood = cyState.cy.nodes(`#${testNode}`).closedNeighborhood();
    var removedEdges = null;
    const nhoodNodeClone = nHood.clone().nodes(); // only want nodes as adding all edges back as well
    const nhoodEdges = nHood
      .nodes()
      .map((n) => ({
        group: "edges",
        classes: "nhood",
        data: {
          id: `g${testNode}e${n.id()}`,
          source: testNode,
          target: n.id(),
        },
      }))
      .filter((el) => el.data.target !== el.data.source);

    if (networkVeiw === true) {
      nHood.nodes().move({ parent: null }); // need to move nodes out of parent as removing parent removes nodes
      removedEdges = cyState.cy.remove(`edge`); //remove function dosent work well, so have to remove all edges and add them to a variable to restore later
      cyState.cy.nodes().addClass("hide"); // hide all nodes and there connected edges
      nHood.removeClass("hide"); // show all neibour nodes of selected node
      cyState.cy.add(nhoodEdges); //add new edges
      nHood.layout(LAYOUT_T).run(); //run concentric layout
    } else if (networkVeiw === false && removedEdges !== null) {
      const newNhood = cyState.cy.nodes(`#${testNode}`).closedNeighborhood(); // gets all the items just added
      cyState.cy.remove(newNhood); //removes all items from previous veiw
      cyState.cy.add(nhoodNodeClone); //restores nodes
      cyState.cy.add(removedEdges); //resstores all edges
      cyState.cy.elements().removeClass("hide"); //disply all elements
      cyState.cy.layout(LAYOUTS(nodeCountRef.current, totalActCountRef.current, false).FCOSE).run(); // run the cose layout again
    }
  }

  cyState.cy && networkLayout();

  return (
    <CytoscapeComponent
      // cy prop allows acess to cy elements/functions
      cy={(cy) => {
        cyState.cy = cy;
        cy.on("resize", (_evt) => {
          nodeCountRef.current &&
            totalActCountRef.current &&
            cyState.cy.layout(LAYOUTS(nodeCountRef.current, totalActCountRef.current, false).FCOSE).run();
          cyState.cy.fit();
        });
      }}
      elements={cyState.elements}
      // wheelSensitivity={0.1}
      style={style}
      stylesheet={stylesheet(activityEdgeDisplay, stakeholdersDisplay)}
      layout={LAYOUTS.COSE}
    />
  );
}

export default CytoscapeVis;
