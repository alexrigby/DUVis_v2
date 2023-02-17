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
  networkVeiw,
  completedDisplay,
  latestPrPeriodRef,
  prPeriod,
  networkVeiwEls,
  setNetworkVeiwEls,
  engScoreVeiw,
  engagementScoresRef,
}) {
  const renderCounter = useRef(0);
  renderCounter.current = cyState.cy && renderCounter.current + 1;
  cyState.cy && nodeTooltip(cyState.cy); //node tooltip on mouseover

  //-----------------NODE SELECTION---------------------------
  useEffect(() => {
    const nodeClickHandler = (event) => {
      if (event.target.data().network === "yes") {
        const networkID = event.target.data().label; // network node lables are there equivelent node id
        setSelectedNode(cyState.cy.nodes(`#${networkID}`).data()); // set selected node to origional graph node
        styleSelectedElements(cyState.cy, networkID, stakeholdersDisplay);
      } else {
        setSelectedNode((prevState) => (event.target.id() === prevState.id ? { id: "" } : event.target.data())); //if same node is clicked twice clear 'selected node' state
        styleSelectedElements(cyState.cy, event.target.id(), stakeholdersDisplay);
      }
    };

    cyState.cy.on("click", "node", nodeClickHandler); //add event listner to node
    return () => cyState.cy.off("click", "node", nodeClickHandler); //clean up click handler to prevent memory leak
  }, [setSelectedNode, cyState]);

  //---------------------RUN MAIN LAYOUT WHEN NODES ARE ADDED/REMOVED ----------------------------
  useEffect(() => {
    if (!networkVeiw && networkVeiwEls.els.length === 0) {
      cyState.cy.layout(FCOSE(currentActNodeCountRef.current, false)).run();
      cyState.cy.fit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentActNodeCountRef, cyState.cy, cyState.elements.length, networkVeiw]);

  //------------------------RESTORES MAIN LAYOUT IF NETWORK VEIW IS FALSE --------------------------------
  useEffect(() => {
    if (!networkVeiw && networkVeiwEls.els.length !== 0) {
      cyState.cy.nodes().removeClass("hide");
      cyState.cy.remove(cyState.cy.nodes(`[network = "yes"]`));
      setNetworkVeiwEls({ ID: "", els: [] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [networkVeiw, networkVeiwEls.els.length, networkVeiwEls.ID]);

  //----------------------------------MAKE NETWORK VEIW NODES------------------------------------
  useEffect(() => {
    if (networkVeiw && selectedNode.id !== "" && selectedNode.type !== "wp") {
      cyState.cy.nodes().removeClass("show");
      cyState.cy.nodes().addClass("hide");
      const newEls = makeNHoodLayout(cyState, selectedNode);
      setNetworkVeiwEls((prevState) =>
        newEls.els.length === prevState.els.length && prevState.ID === newEls.ID ? prevState : newEls
      );

      cyState.cy.add(networkVeiwEls.els);
      cyState.cy.nodes("[network = 'yes']").layout(CONCENTRIC).run();
      nodeTooltip(cyState.cy); //produces tooltips on mouuseover
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    networkVeiw,
    networkVeiwEls.ID,
    selectedNode.id,
    cyState.elements.length,
    selectedNode,
    setNetworkVeiwEls,
    networkVeiwEls.els,
  ]);

  const style = {
    display: cyState.display,
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
          renderCounter.current === 1 && cy.layout(FCOSE(currentActNodeCountRef.current, false)).run();
        });
      }}
      elements={cyState.elements}
      style={style}
      stylesheet={stylesheet(
        activityEdgeDisplay,
        stakeholdersDisplay,
        completedDisplay,
        latestPrPeriodRef,
        prPeriod,
        networkVeiw,
        cyState,
        selectedNode,
        engScoreVeiw,
        engagementScoresRef
      )}
    />
  );
}

export default CytoscapeVis;
