import React, { useEffect, useRef } from "react";
import CytoscapeComponent from "react-cytoscapejs";

import { FCOSE } from "./functions/LAYOUTS";
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
  // const prevSelectedNode = useRef({ id: "" }); // see which node was selected last
  // // const preveCyElsLength = useRef(null);
  // useEffect(() => {
  //   //updates previous state ref when state changes
  //   prevSelectedNode.current = selectedNode;
  // }, [selectedNode]);

  //NODE SELECTION, called every time setSideBarVis or cyState chanages,
  useEffect(() => {
    nodeTooltip(cyState.cy); //produces tooltips on mouuseover
    const nodeClickHandler = (event) => {
      if (event.target.data().network === "yes") {
        const networkID = event.target.data().label; // network node ables are there equivelent node id
        setSelectedNode(cyState.cy.nodes(`#${networkID}`).data()); // set selected node to origional graph node
      } else {
        setSelectedNode((prevState) => (event.target.id() === prevState.id ? { id: "" } : event.target.data())); //if same node is clicked twice clear 'selected node' state
        styleSelectedElements(cyState.cy, event.target.id());
      }
    };

    cyState.cy.on("click", "node", nodeClickHandler); //add event listner to node
    return () => cyState.cy.off("click", "node", nodeClickHandler); //clean up click handler to prevent memory leak
  }, [setSelectedNode, cyState]);

  //RUNS LAYOUT WHEN NODES ARE ADDED/REMOVED
  useEffect(() => {
    //only runs when the elements length chnages--- hakey but works
    currentActNodeCountRef.current &&
      origionalActCountRef.current &&
      cyState.cy.layout(FCOSE(currentActNodeCountRef.current, origionalActCountRef.current, false)).run();
    cyState.cy.fit();
  }, [cyState.cy, cyState.elements.length, currentActNodeCountRef, origionalActCountRef]);

  //REMOVES NETWORK LAYOUT NODES
  useEffect(() => {
    function restoreLayout() {
      const newNhood = cyState.cy.nodes(`[network = "yes"]`);
      console.log(newNhood.length);
      cyState.cy.remove(newNhood); //deletes newly added nodes
      cyState.cy.elements().removeClass("hide"); //disply all elements
      cyState.cy.layout(FCOSE(currentActNodeCountRef.current, origionalActCountRef.current, true)).run();
    }

    !networkVeiw && cyState.cy && restoreLayout(); // if networkveiw is false and then remove all extra nodes and restore origional graph
  }, [currentActNodeCountRef, cyState.cy, networkVeiw, origionalActCountRef]);

  useEffect(() => {
    networkVeiw &&
      selectedNode.id !== "" &&
      selectedNode.type !== "wp" &&
      makeNHoodLayout(cyState, selectedNode, completedDisplay, latestPrPeriodRef, prPeriod); // only run if there is a selected node and network is true
  }, [completedDisplay, cyState, latestPrPeriodRef, networkVeiw, prPeriod, selectedNode]);

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
        cy.on("resize", (_evt) => {
          currentActNodeCountRef.current &&
            origionalActCountRef.current &&
            cyState.cy.layout(FCOSE(currentActNodeCountRef.current, origionalActCountRef.current, false)).run();
          cyState.cy.fit();
        });
      }}
      elements={cyState.elements}
      // wheelSensitivity={0.1}
      style={style}
      stylesheet={stylesheet(activityEdgeDisplay, stakeholdersDisplay)}
      // layout={FCOSE(currentActNodeCountRef.current, origionalActCountRef.current, false)}
    />
  );
}

export default CytoscapeVis;
