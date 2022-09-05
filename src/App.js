import React, { useEffect, useRef, useState } from "react";

import Header from "./components/header/Header";
import SideBar from "./components/sideBar/SideBar";
import Cytoscape from "./components/cytoscape/Cytoscape";
import Legend from "./components/legend/Legend";
import BottomPannel from "./components/bottomPannel/BottomPannel";

import resetVeiwOnDoubleClick from "./AppFunctions/resetveiwOnDoubleClick";
import makeVisElements from "./functions/makeVisElements";
import LAYOUTS from "./components/cytoscape/functions/cyLayouts";
import makeCyWpEdges from "./components/cytoscape/functions/makeCyWpEdges";
import addCategoryIcon from "./components/cytoscape/functions/addCategoryIcons";

import dataset from "./data/TDR Matrix_Subset.txt";
import links from "./data/links.txt";
import wpDataset from "./data/wp_names.txt";
import datesData from "./data/dates.txt";

export function App() {
  //sets state of cy
  const [cyState, setCyState] = useState({
    display: "none",
    cy: null,
    elements: [],
  });
  //sets initial state for selected node
  const [selectedNode, setSelectedNode] = useState({ id: "" });

  //stores parsed gantchart data
  const gantchartData = useRef(null);

  const vegaAnalyticsData = useRef({ dates: null, actData: null });

  //stores date for headerProgress report radio button
  const datePr = useRef(null);

  const [prPeriod, setPrPeriod] = useState(
    datePr.current !== null ? datePr.current[datePr.current.length - 1].prPeriod : null
  );

  console.log(prPeriod);
  useEffect(() => {
    //updates cyytoscape state to include node and edge data and creates gantchart data
    async function addDataToCytoscape() {
      const { cyElms, wpData, gantChartItems, activityData, dates } = await makeVisElements(
        dataset,
        links,
        wpDataset,
        datesData,
        prPeriod
      ); //combines parsing functions to make elements array

      const wpEdge = makeCyWpEdges(cyState.cy, wpData); //creates wp Edges

      vegaAnalyticsData.current.actData = activityData;
      vegaAnalyticsData.current.dates = dates;

      datePr.current = dates;

      gantchartData.current = gantChartItems; //asign gant chart data to the ref

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

    addCategoryIcon(cyState.cy);
  }, [cyState.cy, cyState.elements.length, prPeriod]);

  return (
    <div className="container" onDoubleClick={() => resetVeiwOnDoubleClick(setSelectedNode, cyState)}>
      <div className="top-layer">
        <Header cyState={cyState} datePr={datePr} setPrPeriod={setPrPeriod} />
        <Legend cyState={cyState} />
        <SideBar selectedNode={selectedNode} cyState={cyState} setSelectedNode={setSelectedNode} />
        <BottomPannel
          gantchartData={gantchartData}
          cyState={cyState}
          setSelectedNode={setSelectedNode}
          vegaAnalyticsData={vegaAnalyticsData}
        />
      </div>
      <Cytoscape cyState={cyState} setSelectedNode={setSelectedNode} />
    </div>
  );
}

export default App;
