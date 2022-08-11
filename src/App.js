import React, { useEffect, useState } from "react";
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

export function App() {
  //sets state of cy
  const [cyState, setCyState] = useState({
    w: window.innerWidth,
    h: window.innerHeight,
    display: "none",
    cy: null,
    elements: CytoscapeComponent.normalizeElements(dummyData),
  });

  //sets initial state for selected node
  const [selectedNode, setSelectedNode] = useState({ id: "" });
  useEffect(() => {
    async function parseAllData() {
      const cyElms = await makeCyElements(dataset, links, wpDataset); //combines parsing functions to make elements array
      setCyState((prevState) => ({
        ...prevState,
        elements: cyElms,
        display: "block",
      })); //sets elements array as the cytoscape elements
      cyState.cy.layout(LAYOUTS.COSE).run();
    }
    parseAllData()
      //  catch any error
      .catch(console.error);
  }, [cyState.cy]);

  return (
    <div className="container" onDoubleClick={() => resetVeiwOnDoubleClick(setSelectedNode, cyState)}>
      <Cytoscape
        cyState={cyState}
        setCyState={setCyState}
        setSelectedNode={setSelectedNode}
        selectedNode={selectedNode}
      />
      <Header cyState={cyState} />
      <SideBar selectedNode={selectedNode} /> {/* pass state as prop to Side Bar*/}
    </div>
  );
}

export default App;
