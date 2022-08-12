import React, { useEffect, useRef, useState } from "react";
import CytoscapeComponent from "react-cytoscapejs";

// import data from "./data";

import Header from "./components/header/Header";
import SideBar from "./components/sideBar/SideBar";
import Cytoscape from "./components/cytoscape/Cytoscape";

import dummyData from "./dummyData"; //at the mment using dummy data so cytoscape dosent error when main data is being parsed
import resetVeiwOnDoubleClick from "./AppFunctions/resetveiwOnDoubleClick";
import makeCyElements from "./functions/makeCyElements";
import LAYOUTS from "./components/cytoscape/functions/cyLayouts";

import dataset from "./data/TDR Matrix_Subset.txt";
import links from "./data/links.txt";
import wpDataset from "./data/wp_names.txt";
import makeCyWpEdges from "./components/cytoscape/functions/makeCyWpEdges";

export function App() {
  //sets state of cy
  const [cyState, setCyState] = useState({
    display: "none",
    cy: null,
    elements: CytoscapeComponent.normalizeElements(dummyData),
  });

  //sets initial state for selected node
  const [selectedNode, setSelectedNode] = useState({ id: "" });
  useEffect(() => {
    //updates cyytoscape state to include node and edge data
    async function addDataToCytoscape() {
      var { cyElms, wpData } = await makeCyElements(dataset, links, wpDataset); //combines parsing functions to make elements array

      const wpEdge = makeCyWpEdges(cyState.cy, wpData); //creates wp Edges

      setCyState((prevState) => ({
        ...prevState,
        elements: wpEdge ? [...cyElms, ...wpEdge] : cyElms, //if wpEdges exist then add them, if not use cyElms
        display: "block",
      })); //sets elements array as the cytoscape element
      cyState.cy.layout(LAYOUTS.COSE).run();
    }

    addDataToCytoscape()
      //  catch any error
      .catch(console.error);
  }, [cyState.cy]);

  return (
    <div className="container" onDoubleClick={() => resetVeiwOnDoubleClick(setSelectedNode, cyState)}>
      <Cytoscape cyState={cyState} setSelectedNode={setSelectedNode} />
      <Header cyState={cyState} />
      <SideBar selectedNode={selectedNode} /> {/* pass state as prop to Side Bar*/}
    </div>
  );
}

export default App;
