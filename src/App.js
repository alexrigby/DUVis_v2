import React, { useState } from "react";

import Header from "./components/header/Header";
import SideBar from "./components/sideBar/SideBar";
import Cytoscape from "./components/cytoscape/Cytoscape";

export function App() {
  //state determining weather the side bar is visible or not (default: not)
  const [sideBarVis, setSideBarVis] = useState(false);

  return (
    <div className="container" onDoubleClick={() => setSideBarVis(false)}>
      <Header />
      <SideBar vis={sideBarVis} /> {/* pass state as prop to Side Bar*/}
      <Cytoscape setSideBarVis={setSideBarVis} />
    </div>
  );
}

export default App;
