import React, { useEffect, useState } from "react";
import CytoscapeComponent from "react-cytoscapejs";

// import data from "./data";

import Header from "./components/header/Header";
import SideBar from "./components/sideBar/SideBar";
import Cytoscape from "./components/cytoscape/Cytoscape";

import data from "./data";
import resetVeiwOnDoubleClick from "./AppFunctions/resetveiwOnDoubleClick";
import makeCyElements from "./functions/makeCyElements";

import dataset from "./data/TDR Matrix_Subset.txt";
import links from "./data/links.txt";

export function App() {
  //sets state of cy
  const [cyState, setCyState] = useState({
    w: window.innerWidth,
    h: window.innerHeight,
    cy: null,
    elements: CytoscapeComponent.normalizeElements(data),
  });

  //sets initial state for selected node
  const [selectedNode, setSelectedNode] = useState({ id: "" });

  useEffect(() => {
    async function parseAllData() {
      const cyElms = await makeCyElements(dataset, links);
      setCyState((prevState) => ({
        ...prevState,
        elements: cyElms,
      }));
    }
    parseAllData()
      // make sure to catch any error
      .catch(console.error);
  }, []);
  console.log(cyState);
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
