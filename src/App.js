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
import getEngLevels from "./AppFunctions/getEngLevels";

export function App() {
  //-----------------SET STATES-------------------------
  const [cyState, setCyState] = useState({
    display: "none",
    cy: null,
    elements: [],
  });
  const [selectedNode, setSelectedNode] = useState({ id: "" }); //what node is selected
  const [prPeriod, setPrPeriod] = useState({ pr: null, undefined: true }); // selected prPeriod
  const [currentStory, setCurrentStory] = useState(null); //story IDs
  const [activityEdgeDisplay, setActivityEdgeDisplay] = useState("wp"); //toggle edges
  const [completedDisplay, setCompletedDisplay] = useState(false); //sets nodes opacity
  const [stakeholdersDisplay, setStakeholdersDisplay] = useState(false); //show/hide stakeholders
  const [networkVeiw, setNetworkVeiw] = useState(false); // show/hide network veiw
  const [selectedBottomVis, setSelectedBottomVis] = useState(""); //which bottom pannel is open
  const [networkVeiwEls, setNetworkVeiwEls] = useState({ ID: "", els: [] }); //holds elements for network veiw
  const [engScoreVeiw, setEngeScoreVeiw] = useState(false); // show engagement ranking
  const [customStoryDisplay, setCustomStoryDisplay] = useState(false); //open custom filter options

  // ---------------------------USE REFS-------------------------------
  const gantchartDataRef = useRef(null); //stores parsed gantchart data
  const datesRef = useRef(null); //stores dates
  const actDataRef = useRef(null); //stores activity data
  const stakeholderDataRef = useRef(null); //stakeholder data
  const currentActNodeCountRef = useRef(null); //number of activitiy nodes
  const latestPrPeriodRef = useRef(null); //current period in time
  const engagementScoresRef = useRef(null); //engagment level and ranking

  currentActNodeCountRef.current = actDataRef.current && actDataRef.current.length;

  //----------------------- FETCH DATA FOR USE IN APP-----------------------------------
  useEffect(() => {
    //updates cyytoscape state to include node and edge data and creates gantchart data
    async function addDataToCytoscape() {
      const { cyElms, gantChartItems, activityData, dates, stakeholderData, latestPrPeriod } = await makeVisElements(
        prPeriod,
        currentStory,
        completedDisplay
      ); //all pre-processing of data

      actDataRef.current = activityData; //asigns activity data to ref
      stakeholderDataRef.current = stakeholderData;
      datesRef.current = dates; //assigns dates ro ref
      gantchartDataRef.current = gantChartItems; //asign gant chart data to the ref
      latestPrPeriodRef.current = latestPrPeriod;

      setCyState((prevState) => ({
        ...prevState,
        elements: cyElms,
        display: "block",
      }));
    }
    addDataToCytoscape();
  }, [completedDisplay, cyState.cy, cyState.elements.length, prPeriod, currentStory]);

  //------------------------------------------ENGAGEMENT RANKING--------------------------------------------
  // saves engagement ranking and level in object that persists between renders
  useEffect(() => {
    var eachEngagementRanking = [];
    for (let i = 0; i < latestPrPeriodRef.current; i++) {
      eachEngagementRanking.push(getEngLevels(i + 1, cyState));
    }
    engagementScoresRef.current = eachEngagementRanking;

    //only run once, when cyState.cy is initialized
  }, [cyState.cy]);

  // adds the engagement ranking to individual stakeholders
  useEffect(() => {
    var pr = prPeriod.pr === null ? latestPrPeriodRef.current : prPeriod.pr; //use latest pr or filtered pr period
    const stakeholders = networkVeiw // use network items or full diagram
      ? cyState.cy.nodes("[type = 'stakeholderNode'][network = 'yes']")
      : cyState.cy.nodes("[type = 'stakeholderNode']");
    //Add engagement rank to each stakeholder
    stakeholders.forEach((s) => {
      const engRank = engagementScoresRef.current[pr - 1].individualEngScores.filter((item) =>
        networkVeiw ? `N_${item.id}` === s.id() : item.id === s.id()
      );
      s.data("weight", engRank[0].engRank);
    });
    //run when length oof elements chnage i.e. pr period changes
  }, [cyState.elements.length]);

  //---------------------- STYLE -------------------------------------
  const centerGraph = (event) => {
    setTimeout(() => {
      cyState.cy.fit();
    }, 1);
  };

  // HIDE SIDE PANNEL (bug in splitpane so this is best option)
  document.querySelectorAll(".Pane2").forEach((el) => {
    el.style.display = selectedNode.id === "" ? "none" : "block";
  });

  return (
    <div className="container">
      <div className="Resizer">
        <SplitPane split="vertical" minSize={"20em"} defaultSize={"20em"} allowResize={true} primary="second">
          <div>
            <div className="top-layer">
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
                  setStakeholdersDisplay={setStakeholdersDisplay}
                  currentActNodeCountRef={currentActNodeCountRef}
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
                <div>
                  <button onClick={centerGraph} title="center graph">
                    <i className="fa fa-crosshairs"></i>
                  </button>
                </div>
              </div>

              <BottomPannel
                gantchartDataRef={gantchartDataRef}
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
                networkVeiw={networkVeiw}
                completedDisplay={completedDisplay}
                latestPrPeriodRef={latestPrPeriodRef}
                prPeriod={prPeriod}
                networkVeiwEls={networkVeiwEls}
                setNetworkVeiwEls={setNetworkVeiwEls}
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
