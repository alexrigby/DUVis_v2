import React, { useEffect, useRef } from "react";
import CytoscapeComponent from "react-cytoscapejs";
// import Cytoscape from "cytoscape";
// import noOverlap from "cytoscape-no-overlap";

import { FCOSE, CONCENTRIC } from "./functions/LAYOUTS";
import stylesheet from "./functions/stylesheet";
import nodeTooltip from "./functions/nodeTooltips";
import styleSelectedElements from "./functions/styleSelectedElements";
import makeNHoodLayout from "./functions/makeNHoodLayout";
// Cytoscape.use(noOverlap);

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
  currentStory,

  engScoreVeiw,
  engagementScoresRef,
}) {
  // useEffect(() => {
  //   const allEngWeight = cyState.cy.nodes("[type = 'stakeholderNode']").map((n) => {
  //     var engLev = [];
  //     //4 for 4 engagement levels
  //     for (let i = 0; i < 4; i++) {
  //       var multiplyFactor = i + 1; // + 1 so not multiplied by 0
  //       //number of each eng level multiplied
  //       engLev.push(n.outgoers(`[engagement = "${i + 1}"]`).targets().length * multiplyFactor);
  //     }
  //     const engScore = engLev.reduce((a, b) => a + b);
  //     n.data("weight", engScore);
  //     return engScore;
  //   });

  //   // console.log(allEngWeight);
  //   const maxEngLevel = Math.max(...allEngWeight);
  //   maxEngScore.current = maxEngLevel;
  // }, [cyState.cy, cyState.elements.length, maxEngScore]);

  const renderCounter = useRef(0);
  const selectedNodeNHoodCount = useRef(null);
  renderCounter.current = cyState.cy && renderCounter.current + 1;

  selectedNodeNHoodCount.current = cyState.cy && cyState.cy.nodes(`#${selectedNode.label}`).closedNeighborhood().length;
  const prevSelectedNodeNHoodCount = useRef(null);

  useEffect(() => {
    prevSelectedNodeNHoodCount.current = selectedNodeNHoodCount.current;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNodeNHoodCount.current]);

  //NODE SELECTION, called every time  or cyState chanages,
  useEffect(() => {
    nodeTooltip(cyState.cy); //produces tooltips on mouuseover
    const nodeClickHandler = (event) => {
      if (event.target.data().network === "yes") {
        const networkID = event.target.data().label; // network node ables are there equivelent node id
        setSelectedNode(cyState.cy.nodes(`#${networkID}`).data()); // set selected node to origional graph node
        styleSelectedElements(cyState.cy, networkID, stakeholdersDisplay);
        // setNetworkVeiwEls(makeNHoodLayout(cyState, event.target.data()));
      } else {
        setSelectedNode((prevState) => (event.target.id() === prevState.id ? { id: "" } : event.target.data())); //if same node is clicked twice clear 'selected node' state
        styleSelectedElements(cyState.cy, event.target.id(), stakeholdersDisplay);
        // setNetworkVeiwEls(makeNHoodLayout(cyState, event.target.data(), networkVeiw));
      }
    };
    cyState.cy.on("click", "node", nodeClickHandler); //add event listner to node
    return () => cyState.cy.off("click", "node", nodeClickHandler); //clean up click handler to prevent memory leak
  }, [setSelectedNode, cyState]);

  //RUNS MAIN LAYOUT WHEN NODES ARE ADDED/REMOVED
  useEffect(() => {
    if (!networkVeiw && networkVeiwEls.els.length === 0) {
      cyState.cy.layout(FCOSE(currentActNodeCountRef.current, origionalActCountRef.current, false)).run();
      cyState.cy.fit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentActNodeCountRef, cyState.cy, cyState.elements.length, networkVeiw, origionalActCountRef]);

  //RESTORES MAIN LAYOUT IF NETWORK VEIW IS FALSE
  useEffect(() => {
    if (!networkVeiw && networkVeiwEls.els.length !== 0) {
      cyState.cy.nodes().removeClass("hide");
      cyState.cy.remove(cyState.cy.nodes(`[network = "yes"]`));
      setNetworkVeiwEls({ ID: "", els: [] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [networkVeiw, networkVeiwEls.els.length, networkVeiwEls.ID]);

  // cyState.cy && console.log(cyState.cy.nodes("[meta.endPrPeriod = 'undefined' ], [meta.endPrPeriod = 'onGoing']"));
  //ADDS NETWORK VEIW NODES
  useEffect(() => {
    if (networkVeiw && selectedNode.id !== "" && selectedNode.type !== "wp") {
      cyState.cy.nodes().removeClass("show");
      cyState.cy.nodes().addClass("hide");
      const newEls = makeNHoodLayout(cyState, selectedNode);
      setNetworkVeiwEls((prevState) =>
        newEls.els.length === prevState.els.length && prevState.ID === newEls.ID ? prevState : newEls
      );
      //Needto work out way of running this block of code only when state changes
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
  console.log(networkVeiw);
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
          renderCounter.current === 1 &&
            cy.layout(FCOSE(currentActNodeCountRef.current, origionalActCountRef.current, false)).run();
        });
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
        cyState,
        selectedNode,

        engScoreVeiw,
        engagementScoresRef
      )}
      // layout={ FCOSE(currentActNodeCountRef.current, origionalActCountRef.current, false)}
    />
  );
}

export default CytoscapeVis;
