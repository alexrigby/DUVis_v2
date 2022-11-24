import React, { useEffect, useRef } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import cloneDeep from "lodash.clonedeep";

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
  networkVeiwEls,
  setNetworkVeiwEls,
  currentStory,
}) {
  const renderCounter = useRef(0);
  renderCounter.current = cyState.cy && renderCounter.current + 1;

  //NODE SELECTION, called every time  or cyState chanages,
  useEffect(() => {
    nodeTooltip(cyState.cy); //produces tooltips on mouuseover
    const nodeClickHandler = (event) => {
      if (event.target.data().network === "yes") {
        const networkID = event.target.data().label; // network node ables are there equivelent node id
        setSelectedNode(cyState.cy.nodes(`#${networkID}`).data()); // set selected node to origional graph node
        styleSelectedElements(cyState.cy, networkID, networkVeiw);
        setNetworkVeiwEls(makeNHoodLayout(cyState, event.target.data()));
      } else {
        setSelectedNode((prevState) => (event.target.id() === prevState.id ? { id: "" } : event.target.data())); //if same node is clicked twice clear 'selected node' state
        styleSelectedElements(cyState.cy, event.target.id());
        setNetworkVeiwEls(makeNHoodLayout(cyState, event.target.data(), networkVeiw));
      }
    };
    cyState.cy.on("click", "node", nodeClickHandler); //add event listner to node
    return () => cyState.cy.off("click", "node", nodeClickHandler); //clean up click handler to prevent memory leak
  }, [setSelectedNode, cyState, networkVeiw, setNetworkVeiwEls]);

  //RUNS MAIN LAYOUT WHEN NODES ARE ADDED/REMOVED
  useEffect(() => {
    if (!networkVeiw && networkVeiwEls.length === 0) {
      cyState.cy.layout(FCOSE(currentActNodeCountRef.current, origionalActCountRef.current, false)).run();
    }
  }, [currentActNodeCountRef, cyState.cy, cyState.elements.length, networkVeiw, origionalActCountRef, networkVeiwEls]);

  //RESTORES MAIN LAYOUT IF NETWORK VEIW IS FALSE
  useEffect(() => {
    if (!networkVeiw) {
      cyState.cy.nodes().removeClass("hide");
      cyState.cy.remove(cyState.cy.nodes(`[network = "yes"]`));
      selectedNode.id === "" && setNetworkVeiwEls([]);
    }
  }, [networkVeiw]);

  //MAKES NETWORK LAYOUT ELEMENTS AND CONTROLS NAVIGATION BETWEEN NETWORK VEIWS
  useEffect(() => {
    if (selectedNode.id !== "" && selectedNode.type !== "wp") {
      setNetworkVeiwEls(makeNHoodLayout(cyState, selectedNode));
    }
  }, [cyState.elements.length]);

  useEffect(() => {
    if (networkVeiw && networkVeiw.length !== 0) {
      cyState.cy.nodes().addClass("hide"); // hide all nodes and there connected edges
      cyState.cy.add(networkVeiwEls).layout(CONCENTRIC).run();
      nodeTooltip(cyState.cy); //produces tooltips on mouuseover
      console.log(networkVeiwEls);
    }
  }, [networkVeiw, networkVeiwEls.length, selectedNode.id]);

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
          renderCounter.current === 2 &&
            cy.layout(FCOSE(currentActNodeCountRef.current, origionalActCountRef.current, true)).run();
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
        cyState
      )}
      // layout={ FCOSE(currentActNodeCountRef.current, origionalActCountRef.current, false)}
    />
  );
}

export default CytoscapeVis;

// import React, { useEffect, useRef } from "react";
// import CytoscapeComponent from "react-cytoscapejs";
// import cloneDeep from "lodash.clonedeep";

// import { FCOSE, CONCENTRIC } from "./functions/LAYOUTS";
// import stylesheet from "./functions/stylesheet";
// import nodeTooltip from "./functions/nodeTooltips";
// import styleSelectedElements from "./functions/styleSelectedElements";
// import makeNHoodLayout from "./functions/makeNHoodLayout";

// export function CytoscapeVis({
//   cyState,
//   setSelectedNode,
//   selectedNode,
//   activityEdgeDisplay,
//   stakeholdersDisplay,
//   currentActNodeCountRef,
//   origionalActCountRef,
//   networkVeiw,
//   completedDisplay,
//   latestPrPeriodRef,
//   prPeriod,
//   networkVeiwEls,
//   setNetworkVeiwEls,
//   currentStory,
// }) {
//   const renderCounter = useRef(0);
//   renderCounter.current = cyState.cy && renderCounter.current + 1;

//   //NODE SELECTION, called every time  or cyState chanages,
//   useEffect(() => {
//     nodeTooltip(cyState.cy); //produces tooltips on mouuseover
//     const nodeClickHandler = (event) => {
//       if (event.target.data().network === "yes") {
//         const networkID = event.target.data().label; // network node ables are there equivelent node id
//         setSelectedNode(cyState.cy.nodes(`#${networkID}`).data()); // set selected node to origional graph node
//         styleSelectedElements(cyState.cy, networkID, networkVeiw);
//         setNetworkVeiwEls(makeNHoodLayout(cyState, event.target.data()));
//       } else {
//         setSelectedNode((prevState) => (event.target.id() === prevState.id ? { id: "" } : event.target.data())); //if same node is clicked twice clear 'selected node' state
//         styleSelectedElements(cyState.cy, event.target.id());
//         setNetworkVeiwEls(makeNHoodLayout(cyState, event.target.data(), networkVeiw));
//       }
//     };
//     cyState.cy.on("click", "node", nodeClickHandler); //add event listner to node
//     return () => cyState.cy.off("click", "node", nodeClickHandler); //clean up click handler to prevent memory leak
//   }, [setSelectedNode, cyState, networkVeiw, setNetworkVeiwEls]);

//   //RUNS MAIN LAYOUT WHEN NODES ARE ADDED/REMOVED
//   useEffect(() => {
//     if (!networkVeiw && networkVeiwEls.length === 0) {
//       cyState.cy.layout(FCOSE(currentActNodeCountRef.current, origionalActCountRef.current, false)).run();
//     }
//   }, [currentActNodeCountRef, cyState.cy, cyState.elements.length, networkVeiw, origionalActCountRef, networkVeiwEls]);

//   //RESTORES MAIN LAYOUT IF NETWORK VEIW IS FALSE
//   useEffect(() => {
//     if (!networkVeiw) {
//       cyState.cy.nodes().removeClass("hide");
//       cyState.cy.remove(cyState.cy.nodes(`[network = "yes"]`));
//       selectedNode.id === "" && setNetworkVeiwEls([]);
//     }
//   }, [networkVeiw]);

//   //MAKES NETWORK LAYOUT ELEMENTS AND CONTROLS NAVIGATION BETWEEN NETWORK VEIWS
//   useEffect(() => {
//     if (selectedNode.id !== "" && selectedNode.type !== "wp") {
//       setNetworkVeiwEls(makeNHoodLayout(cyState, selectedNode));
//     }
//   }, [cyState.elements.length]);

//   useEffect(() => {
//     if (networkVeiw && networkVeiw.length !== 0) {
//       cyState.cy.nodes().addClass("hide"); // hide all nodes and there connected edges
//       cyState.cy.add(networkVeiwEls).layout(CONCENTRIC).run();
//       nodeTooltip(cyState.cy); //produces tooltips on mouuseover
//       console.log(networkVeiwEls);
//     }
//   }, [networkVeiw, networkVeiwEls.length, selectedNode.id]);

//   const style = {
//     display: cyState.display,
//     // display: "none",
//     width: "100%",
//     height: "100%",
//     position: "absolute",
//   };

//   return (
//     <CytoscapeComponent
//       // cy prop allows acess to cy elements/functions
//       cy={(cy) => {
//         cyState.cy = cy;
//         cy.on("resize", (_evt) => {
//           renderCounter.current === 2 &&
//             cy.layout(FCOSE(currentActNodeCountRef.current, origionalActCountRef.current, true)).run();
//         });
//       }}
//       elements={cyState.elements}
//       // wheelSensitivity={0.1}
//       style={style}
//       stylesheet={stylesheet(
//         activityEdgeDisplay,
//         stakeholdersDisplay,
//         completedDisplay,
//         latestPrPeriodRef,
//         prPeriod,
//         networkVeiw,
//         cyState
//       )}
//       // layout={ FCOSE(currentActNodeCountRef.current, origionalActCountRef.current, false)}
//     />
//   );
// }

// export default CytoscapeVis;
