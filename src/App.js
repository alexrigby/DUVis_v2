import React, { useState } from "react";

import Header from "./components/header/Header";
import SideBar from "./components/sideBar/SideBar";
import Cytoscape from "./components/cytoscape/Cytoscape";

export function App() {
  //sets initial state for clicked node
  const [selectedNode, setselectedNode] = useState({ id: "" });

  return (
    <div className="container" onDoubleClick={() => setselectedNode({ id: "" })}>
      <Header />
      <SideBar selectedNode={selectedNode} /> {/* pass state as prop to Side Bar*/}
      <Cytoscape setselectedNode={setselectedNode} />
    </div>
  );
}

export default App;
