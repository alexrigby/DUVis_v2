import React, { useEffect, useRef, useState } from "react";
import CytoscapeComponent from "react-cytoscapejs";

import LAYOUTS from "./functions/cyLayouts";
import stylesheet from "./functions/stylesheet";
import nodeTooltip from "./functions/nodeTooltips";
import styleSelectedElements from "./functions/styleSelectedElements";

export function CytoscapeVis({
  cyState,
  setSelectedNode,
  selectedNode,
  activityEdgeDisplay,
  stakeholdersDisplay,
  nodeCountRef,
  totalActCountRef,
  networkVeiw,
}) {
  const prevSelectedNode = useRef({ id: "" }); // see which node was selected last

  useEffect(() => {
    //updates previous state ref when state changes
    prevSelectedNode.current = selectedNode;
  }, [selectedNode]);

  //called every time setSideBarVis or cyState chanages
  useEffect(() => {
    nodeTooltip(cyState.cy); //produces tooltips on mouuseover
    const nodeClickHandler = (event) => {
      if (event.target.data().network === true) {
        const networkID = event.target.id().split("").splice(2).join("");
        setSelectedNode(cyState.cy.nodes(`#${networkID}`).data());
      } else {
        setSelectedNode((prevState) => (event.target.id() === prevState.id ? { id: "" } : event.target.data())); //if same node is clicked twice clear 'selected node' state
        styleSelectedElements(cyState.cy, event.target.id());
      }
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
      cyState.cy.layout(LAYOUTS(nodeCountRef.current, totalActCountRef.current, false).FCOSE).run();
    cyState.cy.fit();
  }, [cyState.cy, cyState.elements.length, nodeCountRef, totalActCountRef]);

  const LAYOUT_T = {
    name: "concentric",
  };

  function runNHoodLayout() {
    // deletes all neighborhood of previosuly selected node, is no node was selected nothing happens
    const newNhood = cyState.cy.elements(`#N_${prevSelectedNode.current.id}`).closedNeighborhood();
    cyState.cy.remove(newNhood);

    //gets neighboorhood of selected node and makes new nodes and edges
    const nHoodSNodes = cyState.cy
      .nodes(`#${selectedNode.id}`)
      .closedNeighborhood()
      .nodes("[type = 'stakeholderNode']");
    const nHoodActNodes = cyState.cy.nodes(`#${selectedNode.id}`).closedNeighborhood().nodes("[type = 'activityNode']");
    const nHoodSEdges = cyState.cy
      .nodes(`#${selectedNode.id}`)
      .closedNeighborhood()
      .edges("[type = 'stakeholderEdge']");

    const newNHoodSEdges = nHoodSEdges.map((e) => ({
      group: "edges",
      classes: "connectedEdge",
      data: {
        ...e.data(),
        id: "N_" + e.id(),
        source: "N_" + e.data().source,
        target: "N_" + selectedNode.id,
        network: true,
      },
    }));

    const newNHoodSNodes = nHoodSNodes.map((n) => ({
      group: "nodes",
      classes: "networkNodes",
      data: {
        ...n.data(),
        parent: null,
        id: "N_" + n.id(),
        network: true,
      },
    }));

    const newNHoodActNodes = nHoodActNodes.map((n) => ({
      group: "nodes",
      classes: "networkNodes",
      data: {
        ...n.data(),
        parent: null,
        id: "N_" + n.id(),
        network: true,
      },
    }));

    const newNHoodActEdges = newNHoodActNodes // only make one edge for each activity node so all egeds point to the parent
      .map((n) => ({
        group: "edges",
        classes: "connectedEdge",
        data: {
          id: `N_g${selectedNode.id}e${n.data.id}`,
          source: n.data.id,
          target: "N_" + selectedNode.id,
          network: true,
        },
      }))
      .filter((el) => el.data.target !== el.data.source);

    const newNhoodElms = [newNHoodSNodes, newNHoodActNodes, newNHoodActEdges, newNHoodSEdges].flat();
    cyState.cy.nodes().addClass("hide"); // hide all nodes and there connected edges
    cyState.cy.add(newNhoodElms).layout(LAYOUT_T).run(); //add the new nodes to cytoscape and run concentric layout
  }

  useEffect(() => {
    function restoreLayout() {
      const newNhood = cyState.cy.elements(`#N_${prevSelectedNode.current.id}`).closedNeighborhood();
      cyState.cy.remove(newNhood); //deletes newly added nodes
      cyState.cy.elements().removeClass("hide"); //disply all elements
      cyState.cy.layout(LAYOUTS(nodeCountRef.current, totalActCountRef.current, true).FCOSE).run(); //runs the main layout again
    }
    !networkVeiw && cyState.cy && restoreLayout(); // if networkveiw is disselected then remove all extra nodes and restore origional graph
  }, [networkVeiw]); // only runs when networkVew changes (otherwise would restore graph all the time)

  networkVeiw && selectedNode.id !== "" && runNHoodLayout();

  console.log(selectedNode);
  console.log(prevSelectedNode.current);

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

// function networkLayoutRestore() {
//   const newNhood = cyState.cy.nodes(`#${selectedNode.id}`).closedNeighborhood(); // gets all the items just added
//   cyState.cy.remove(newNhood); //removes all items from previous veiw
//   cyState.cy.add(nHoodNodeCloneRef.current); //restores nodes
//   cyState.cy.add(removedEdgesRef.current); //resstores all edges
//   cyState.cy.elements().removeClass("hide"); //disply all elements
//   cyState.cy.layout(LAYOUTS(nodeCountRef.current, totalActCountRef.current, false).FCOSE).run(); // run the cose layout again
//   removedEdgesRef.current = null;
// }

// console.log(nHoodNodeCloneRef.current);

// useEffect(() => {
//   function networkLayoutRun() {
//     const nHood = cyState.cy.nodes(`#${selectedNode.id}`).closedNeighborhood();
//     nHoodNodeCloneRef.current = nHood.clone().nodes(); // only want nodes as adding all edges back as well
//     const nhoodEdges = nHood
//       .nodes()
//       .map((n) => ({
//         group: "edges",
//         classes: "connectedEdge",
//         data: {
//           id: `g${selectedNode.id}e${n.id()}`,
//           source: n.id(),
//           target: selectedNode.id,
//         },
//       }))
//       .filter((el) => el.data.target !== el.data.source);
//     console.log(removedEdgesRef.current);

//     nHood.nodes().move({ parent: null }); // need to move nodes out of parent as removing parent removes nodes
//     removedEdgesRef.current = cyState.cy.remove(`edge`); //remove function dosent work well, so have to remove all edges and add them to a variable to restore later
//     cyState.cy.nodes().addClass("hide"); // hide all nodes and there connected edges
//     nHood.removeClass("hide"); // show all neibour nodes of selected node
//     cyState.cy.add(nhoodEdges); //add new edges
//     nHood.layout(LAYOUT_T).run(); //run concentric layout
//   }

//   selectedNode.id !== "" && networkVeiw && networkLayoutRun();
// }, [selectedNode.id, networkVeiw]);

// useEffect(() => {
//   !networkVeiw && removedEdgesRef.current !== null && networkLayoutRestore();
// }, [networkVeiw]);
