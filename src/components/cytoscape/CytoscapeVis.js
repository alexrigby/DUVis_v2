import React, { useEffect, useRef } from "react";
import CytoscapeComponent from "react-cytoscapejs";

import { FCOSE, CONCENTRIC } from "./functions/LAYOUTS";
import stylesheet from "./functions/stylesheet";
import nodeTooltip from "./functions/nodeTooltips";
import styleSelectedElements from "./functions/styleSelectedElements";
import makeNHoodLayout from "./functions/makeNHoodLayout";
import { render } from "@testing-library/react";

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
  networkVeiwEls,
  setNetworkVeiwEls,
}) {
  const renderCounter = useRef(0);
  renderCounter.current = cyState.cy && renderCounter.current + 1;
  console.log(renderCounter.current);

  //NEED TO RUN LAYOUT ON RENDER "when wp Edges are added"
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

  //RUNS MAIN LAYOUT WHEN NODES ARE ADDED/REMOVED
  useEffect(() => {
    !networkVeiw &&
      networkVeiwEls.length === 0 &&
      cyState.cy.layout(FCOSE(currentActNodeCountRef.current, origionalActCountRef.current, false)).run();
    // cyState.cy.fit();
  }, [currentActNodeCountRef, cyState.cy, cyState.elements.length, networkVeiw, origionalActCountRef, networkVeiwEls]);

  //RESTORES MAIN LAYOUT IF NETWORK VEIW IS FALSE
  useEffect(() => {
    if (!networkVeiw && networkVeiwEls.length > 0) {
      cyState.cy.nodes().removeClass("hide");
      cyState.cy.remove(cyState.cy.nodes(`[network = "yes"]`));
      setNetworkVeiwEls([]);
    }
  }, [cyState.cy, networkVeiw, networkVeiwEls.length, setNetworkVeiwEls]);

  //MAKES NETWORK LAYOUT ELEMENTS AND CONTROLS NAVIGATION BETWEEN NETWORK VEIWS
  useEffect(() => {
    if (networkVeiw && selectedNode.id !== "" && selectedNode.type !== "wp") {
      cyState.cy.remove(cyState.cy.nodes(`[network = "yes"]`)); //remove network nodes
      cyState.cy.nodes().addClass("hide"); // hide all nodes and there connected edges
      const newNodes = makeNHoodLayout(cyState, selectedNode);
      setNetworkVeiwEls(newNodes);
    }
    if (networkVeiw && networkVeiwEls.length > 0) {
      cyState.cy.add(networkVeiwEls).layout(CONCENTRIC).run();
      nodeTooltip(cyState.cy); //produces tooltips on mouuseover
    }
    console.log("rend");
  }, [networkVeiw, selectedNode, networkVeiwEls.length, cyState.elements.length, setNetworkVeiwEls]);

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
      stylesheet={stylesheet(
        activityEdgeDisplay,
        stakeholdersDisplay,
        completedDisplay,
        latestPrPeriodRef,
        prPeriod,
        networkVeiw,
        cyState
      )}
      // layout={FCOSE(currentActNodeCountRef.current, origionalActCountRef.current, false)}
    />
  );
}

export default CytoscapeVis;
