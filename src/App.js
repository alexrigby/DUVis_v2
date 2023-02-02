import React, { useEffect, useRef, useState } from "react";
import SplitPane from "react-split-pane";

import Header from "./components/header/Header";
import SidePannel from "./components/sidePannel/SidePannel";
import CytoscapeVis from "./components/cytoscape/CytoscapeVis";
import Legend from "./components/legend/Legend";
import BottomPannel from "./components/bottomPannel/BottomPannel";
import FilterOptions from "./components/FilterOptions/FilterOptions";
import ToggleButtons from "./components/ToggleButtons/ToggleButtons";

import resetVeiwOnDoubleClick from "./AppFunctions/resetveiwOnDoubleClick";
import makeVisElements from "./functions/makeVisElements";
import { use } from "cytoscape";

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
  const [customStoryDisplay, setCustomStoryDisplay] = useState(false);

  const gantchartData = useRef(null); //stores parsed gantchart data
  const datesRef = useRef(null); //stores dates
  const actDataRef = useRef(null); //stores activity data
  const stakeholderDataRef = useRef(null); //stakeholder data
  const currentActNodeCountRef = useRef(null);
  const matrixHeadersRef = useRef(null);
  const origionalActCountRef = useRef(null);
  const latestPrPeriodRef = useRef(null);

  const engagementScoresRef = useRef(0);

  currentActNodeCountRef.current = actDataRef.current && actDataRef.current.length;
  // console.log("render");
  const currentPrPeriod = datesRef.current && datesRef.current[datesRef.current.length - 1].prPeriod;
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

  useEffect(() => {
    function getEngLevels(pr) {
      var individualEngLev = [];
      var engLevel = [];
      const stakeholders = cyState.cy.nodes("[type = 'stakeholderNode']");
      for (let k = 0; k < stakeholders.length; k++) {
        var engPrPeriod = [];
        //4 for 4 engagement levels
        for (let j = 0; j < 4; j++) {
          var multiplyFactor = j + 1; // + 1 so not multiplied by
          //number of each eng level multiplied
          engPrPeriod.push(
            stakeholders[k].outgoers(`[engagement = "${j + 1}"]`).targets(`[meta.startPrPeriod <= ${pr}]`).length *
              multiplyFactor
          );
        }
        const engScore = engPrPeriod.reduce((a, b) => a + b);
        // stakeholders[k].data("weight", engScore);
        individualEngLev.push({ id: stakeholders[k].id(), engRank: engScore }); //push sum of each stakeholder engagemnt
        engLevel.push(engScore);
      }
      const maxEngScore = Math.max(...engLevel);
      const individualEngScores = individualEngLev;
      return { maxEngScore, individualEngScores };
    }
    var eachEngagementRanking = [];
    // 13 for 13 pr periods
    for (let i = 0; i < currentPrPeriod; i++) {
      eachEngagementRanking.push(getEngLevels(i + 1));
    }

    engagementScoresRef.current = eachEngagementRanking;
  }, [cyState.cy]);

  useEffect(() => {
    var pr = prPeriod.pr === null ? currentPrPeriod : prPeriod.pr;
    const stakeholders = networkVeiw
      ? cyState.cy.nodes("[type = 'stakeholderNode'][network = 'yes']")
      : cyState.cy.nodes("[type = 'stakeholderNode']");

    stakeholders.map((s) => {
      const sEngRank = engagementScoresRef.current[pr - 1].individualEngScores.filter((item) =>
        networkVeiw ? `N_${item.id}` === s.id() : item.id === s.id()
      );
      s.data("weight", sEngRank[0].engRank);
    });
  }, [cyState.elements.length]);

  const centerGraph = (event) => {
    setTimeout(() => {
      cyState.cy.fit();
    }, 1);
  };

  //need to think of something better than this!!!!!!!!!!!
  document.querySelectorAll(".Pane2").forEach((el) => {
    el.style.display = selectedNode.id === "" ? "none" : "block";
  });

  return (
    <div className="container">
      <div className="Resizer">
        <SplitPane split="vertical" minSize={"20em"} defaultSize={"20em"} allowResize={true} primary="second">
          <div>
            <div className="top-layer">
              {/* <SidePannel
              selectedNode={selectedNode}
             cyState={cyState}
             setSelectedNode={setSelectedNode}
             datesRef={datesRef}
             prPeriod={prPeriod}
             networkVeiw={networkVeiw}
             setStakeholdersDisplay={setStakeholdersDisplay}
               /> */}
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
                    cyState={cyState}
                    setNetworkVeiw={setNetworkVeiw}
                    customStoryDisplay={customStoryDisplay}
                    setCustomStoryDisplay={setCustomStoryDisplay}
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
                  setCustomStoryDisplay={setCustomStoryDisplay}
                />
              </div>
              <div className="zoomButtons">
                {/* <div>
                  <button title="zoom in">
                    <i className="fa fa-magnifying-glass-plus"></i>
                  </button>
                </div> */}
                <div>
                  {/* <button title="zoom out">
                    <i className="fa fa-magnifying-glass-minus"></i>
                  </button> */}
                  <button onClick={centerGraph} title="center graph">
                    <i className="fa fa-crosshairs"></i>
                  </button>
                </div>
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
            <div onDoubleClick={() => resetVeiwOnDoubleClick(setSelectedNode, cyState, networkVeiw)}>
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
                engScoreVeiw={engScoreVeiw}
                engagementScoresRef={engagementScoresRef}
              />
            </div>
          </div>
          <div id="sideP" data-open="false">
            <SidePannel
              selectedNode={selectedNode}
              cyState={cyState}
              setSelectedNode={setSelectedNode}
              datesRef={datesRef}
              prPeriod={prPeriod}
              networkVeiw={networkVeiw}
              setStakeholdersDisplay={setStakeholdersDisplay}
            />
          </div>
        </SplitPane>
      </div>
    </div>
  );
}

export default App;
