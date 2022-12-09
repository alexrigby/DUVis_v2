import React, { useEffect, useRef, useState } from "react";

import Header from "./components/header/Header";
import SidePannel from "./components/sidePannel/SidePannel";
import CytoscapeVis from "./components/cytoscape/CytoscapeVis";
import Legend from "./components/legend/Legend";
import BottomPannel from "./components/bottomPannel/BottomPannel";
import FilterOptions from "./components/FilterOptions/FilterOptions";
import ToggleButtons from "./components/ToggleButtons/ToggleButtons";

import resetVeiwOnDoubleClick from "./AppFunctions/resetveiwOnDoubleClick";
import makeVisElements from "./functions/makeVisElements";

// import addCategoryIcon from "./components/cytoscape/functions/addCategoryIcons";

export function App() {
  //sets state of cy
  const [cyState, setCyState] = useState({
    display: "none",
    cy: null,
    elements: [],
  });

  const [selectedNode, setSelectedNode] = useState({ id: "" }); //sets initial state for selected node
  const [prPeriod, setPrPeriod] = useState({ pr: null, undefined: true }); //sets state for pr period
  const [currentStory, setCurrentStory] = useState(null); //sets story ids state
  const [activityEdgeDisplay, setActivityEdgeDisplay] = useState("wp"); //sets if wp edges or activity edges are displayed
  const [completedDisplay, setCompletedDisplay] = useState(false); //sets if nodes opacity is defined by completion status
  const [connectionFlagsDisplay, setConnectionFlagsDisplay] = useState(false);
  const [stakeholdersDisplay, setStakeholdersDisplay] = useState(false);
  const [networkVeiw, setNetworkVeiw] = useState(false);
  const [selectedBottomVis, setSelectedBottomVis] = useState("");
  const [networkVeiwEls, setNetworkVeiwEls] = useState({ ID: "", els: [] });
  const [engScoreVeiw, setEngeScoreVeiw] = useState(false);

  const gantchartData = useRef(null); //stores parsed gantchart data
  const datesRef = useRef(null); //stores dates
  const actDataRef = useRef(null); //stores activity data
  const stakeholderDataRef = useRef(null); //stakeholder data
  const currentActNodeCountRef = useRef(null);
  const matrixHeadersRef = useRef(null);
  const origionalActCountRef = useRef(null);
  const latestPrPeriodRef = useRef(null);
  const maxEngScore = useRef(100);

  currentActNodeCountRef.current = actDataRef.current && actDataRef.current.length;
  // console.log("render");

  useEffect(() => {
    //updates cyytoscape state to include node and edge data and creates gantchart data
    async function addDataToCytoscape() {
      const {
        cyElms,
        gantChartItems,
        activityData,
        dates,
        stakeholderData,
        matrixHeaders,
        origionalActCount,
        latestPrPeriod,
      } = await makeVisElements(prPeriod, currentStory, completedDisplay); //all pre-processing of data

      actDataRef.current = activityData; //ssigns activity data to ref
      stakeholderDataRef.current = stakeholderData;
      datesRef.current = dates; //assigns dates ro ref
      gantchartData.current = gantChartItems; //asign gant chart data to the ref
      matrixHeadersRef.current = matrixHeaders;
      origionalActCountRef.current = origionalActCount;
      latestPrPeriodRef.current = latestPrPeriod;

      setCyState((prevState) => ({
        ...prevState,
        elements: cyElms, //if wpEdges exist then add them, if not use cyElms
        display: "block",
      })); //sets elements array as the cytoscape element
    }
    addDataToCytoscape();
    // addCategoryIcon(cyState.cy);
  }, [completedDisplay, cyState.cy, cyState.elements.length, prPeriod, currentStory]);

  return (
    <div className="container">
      <div onDoubleClick={() => resetVeiwOnDoubleClick(setSelectedNode, cyState, networkVeiw)}>
        <div className="top-layer">
          <SidePannel
            selectedNode={selectedNode}
            cyState={cyState}
            setSelectedNode={setSelectedNode}
            datesRef={datesRef}
            prPeriod={prPeriod}
            networkVeiw={networkVeiw}
            setStakeholdersDisplay={setStakeholdersDisplay}
          />
          <div className="headSection">
            <div className="rightSide">
              <Header
                cyState={cyState}
                datesRef={datesRef}
                prPeriod={prPeriod}
                currentStory={currentStory}
                completedDisplay={completedDisplay}
                networkVeiw={networkVeiw}
              />
              <FilterOptions
                datesRef={datesRef}
                prPeriod={prPeriod}
                setPrPeriod={setPrPeriod}
                currentStory={currentStory}
                setCurrentStory={setCurrentStory}
                actDataRef={actDataRef}
                matrixHeadersRef={matrixHeadersRef}
              />
              <Legend
                cyState={cyState}
                networkVeiw={networkVeiw}
                selectedNode={selectedNode}
                networkVeiwEls={networkVeiwEls}
                engScoreVeiw={engScoreVeiw}
                stakeholdersDisplay={stakeholdersDisplay}
              />
            </div>
            <ToggleButtons
              selectedBottomVis={selectedBottomVis}
              setSelectedBottomVis={setSelectedBottomVis}
              setConnectionFlagsDisplay={setConnectionFlagsDisplay}
              connectionFlagsDisplay={connectionFlagsDisplay}
              setStakeholdersDisplay={setStakeholdersDisplay}
              currentActNodeCountRef={currentActNodeCountRef}
              origionalActCountRef={origionalActCountRef}
              setActivityEdgeDisplay={setActivityEdgeDisplay}
              setCompletedDisplay={setCompletedDisplay}
              cyState={cyState}
              setNetworkVeiw={setNetworkVeiw}
              networkVeiw={networkVeiw}
              activityEdgeDisplay={activityEdgeDisplay}
              completedDisplay={completedDisplay}
              stakeholdersDisplay={stakeholdersDisplay}
              selectedNode={selectedNode}
              engScoreVeiw={engScoreVeiw}
              setEngeScoreVeiw={setEngeScoreVeiw}
            />
          </div>

          <BottomPannel
            gantchartData={gantchartData}
            cyState={cyState}
            setSelectedNode={setSelectedNode}
            actDataRef={actDataRef}
            datesRef={datesRef}
            prPeriod={prPeriod}
            selectedBottomVis={selectedBottomVis}
            setSelectedBottomVis={setSelectedBottomVis}
          />
        </div>

        <CytoscapeVis
          cyState={cyState}
          setSelectedNode={setSelectedNode}
          selectedNode={selectedNode}
          activityEdgeDisplay={activityEdgeDisplay}
          stakeholdersDisplay={stakeholdersDisplay}
          currentActNodeCountRef={currentActNodeCountRef}
          origionalActCountRef={origionalActCountRef}
          networkVeiw={networkVeiw}
          completedDisplay={completedDisplay}
          latestPrPeriodRef={latestPrPeriodRef}
          prPeriod={prPeriod}
          networkVeiwEls={networkVeiwEls}
          setNetworkVeiwEls={setNetworkVeiwEls}
          currentStory={currentStory}
          maxEngScore={maxEngScore}
          engScoreVeiw={engScoreVeiw}
        />
      </div>
    </div>
  );
}

export default App;
