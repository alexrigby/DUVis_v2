import React, { useEffect, useRef } from "react";
import CytoscapeComponent from "react-cytoscapejs";

import { FCOSE, CONCENTRIC } from "./functions/LAYOUTS";
import stylesheet from "./functions/stylesheet";
import nodeTooltip from "./functions/nodeTooltips";
import styleSelectedElements from "./functions/styleSelectedElements";
import makeNHoodLayout from "./functions/makeNHoodLayout";

export function CytoscapeVis({
  cyState,
  setSelectedNode,
  selectedNode,
  activityEdgeDisplay,
  stakeholdersDisplay,
  currentActNodeCountRef,
  origionalActCountRef,
  networkVeiw,
  completedDisplay,
  latestPrPeriodRef,
  prPeriod,
}) {
  const renderCounter = useRef(0);
  renderCounter.current = cyState.cy && renderCounter.current + 1;

  useEffect(() => {
    renderCounter.current === 2 &&
      cyState.cy.layout(FCOSE(currentActNodeCountRef.current, origionalActCountRef.current, true)).run();
    // renderCounter.current === 2 && cyState.cy.fit();
  });

  //NODE SELECTION, called every time setSideBarVis or cyState chanages,
  useEffect(() => {
    nodeTooltip(cyState.cy); //produces tooltips on mouuseover
    const nodeClickHandler = (event) => {
      if (event.target.data().network === "yes") {
        const networkID = event.target.data().label; // network node ables are there equivelent node id
        setSelectedNode(cyState.cy.nodes(`#${networkID}`).data()); // set selected node to origional graph node
        styleSelectedElements(cyState.cy, networkID);
      } else {
        setSelectedNode((prevState) => (event.target.id() === prevState.id ? { id: "" } : event.target.data())); //if same node is clicked twice clear 'selected node' state
        styleSelectedElements(cyState.cy, event.target.id());
      }
    };

    cyState.cy.on("click", "node", nodeClickHandler); //add event listner to node
    return () => cyState.cy.off("click", "node", nodeClickHandler); //clean up click handler to prevent memory leak
  }, [setSelectedNode, cyState]);

  //RUNS MAIN OR NETWORK LAYOUTS WHEN NODES ARE ADDED/REMOVED
  useEffect(() => {
    if (networkVeiw) {
      makeNHoodLayout(cyState, selectedNode, false);
    } else {
      cyState.cy.layout(FCOSE(currentActNodeCountRef.current, origionalActCountRef.current, false)).run();
      cyState.cy.fit();
    }
  }, [cyState.elements.length]);

  //MAKES NETWORK LAYOUT ELEMENTS AND CONTROLS NAVIGATION BETWEEN NETWORK VEIWS
  useEffect(() => {
    networkVeiw && selectedNode.id !== "" && selectedNode.type !== "wp" && makeNHoodLayout(cyState, selectedNode, true); // only run if there is a selected node and network is true
  }, [networkVeiw, selectedNode]);

  //REMOVES NETWORK LAYOUT NODES
  useEffect(() => {
    function restoreLayout() {
      cyState.cy.remove(cyState.cy.nodes(`[network = "yes"]`)); //deletes newly added nodes
      cyState.cy.elements().removeClass("hide"); //disply all elements
      cyState.cy.layout(FCOSE(currentActNodeCountRef.current, origionalActCountRef.current, true)).run();
    }
    !networkVeiw && cyState.cy && restoreLayout(); // if networkveiw is false and then remove all extra nodes and restore origional graph
  }, [currentActNodeCountRef, cyState.cy, networkVeiw, origionalActCountRef]);

  const style = {
    display: cyState.display,
    // display: "none",
    width: "100%",
    height: "100%",
    position: "absolute",
  };

  return (
    <CytoscapeComponent
      // cy prop allows acess to cy elements/functions
      cy={(cy) => {
        cyState.cy = cy;
      }}
      elements={cyState.elements}
      // wheelSensitivity={0.1}
      style={style}
      stylesheet={stylesheet(activityEdgeDisplay, stakeholdersDisplay, completedDisplay, latestPrPeriodRef, prPeriod)}
      // layout={FCOSE(currentActNodeCountRef.current, origionalActCountRef.current, false)}
    />
  );
}

export default CytoscapeVis;
