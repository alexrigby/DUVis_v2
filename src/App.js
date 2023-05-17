import React, { useEffect, useRef, useState, useContext } from "react";
import ConfigContext from "./context/ConfigContext";
import SplitPane from "react-split-pane";

import Header from "./components/header/Header";
import SidePannel from "./components/sidePannel/SidePannel";
import CytoscapeVis from "./components/cytoscape/CytoscapeVis";
import Legend from "./components/legend/Legend";
import BottomPannel from "./components/bottomPannel/BottomPannel";
import FilterOptions from "./components/FilterOptions/FilterOptions";
import ToggleButtons from "./components/ToggleButtons/ToggleButtons";
import Upload from "./components/upload/Upload";
import WarningBar from "./components/warningBar/WarningBar";

import resetVeiwOnDoubleClick from "./AppFunctions/resetveiwOnDoubleClick";
import makeVisElements from "./functions/makeVisElements";

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
  const [uploadVeiw, setUploadVeiw] = useState(false);
  const [userFiles, setUserFiles] = useState({
    config: { fileName: null, errors: null },
    dataset: { fileName: null, errors: null },
  });

  const [fieldWarning, setFieldWarning] = useState(null);
  const [warningBarDisplay, setWarningBarDisplay] = useState(true);

  const [excelDataset, setExcelDataset] = useState(null);

  // ---------------------------USE REFS-------------------------------
  const gantchartDataRef = useRef(null); //stores parsed gantchart data
  const datesRef = useRef(null); //stores dates
  const actDataRef = useRef(null); //stores activity data
  const stakeholderDataRef = useRef(null); //stakeholder data
  const currentActNodeCountRef = useRef(null); //number of activitiy nodes
  const latestPrPeriodRef = useRef(null); //current period in time
  const engagementScoresRef = useRef(null); //engagment level and ranking

  currentActNodeCountRef.current = actDataRef.current && actDataRef.current.length;

  //----------------------------------CONFIG-----------------------------------------
  const { config } = useContext(ConfigContext);

  //----------------------- FETCH EXCEL DATA FOR USE IN APP-----------------------------------
  useEffect(() => {
    const fileString = window.localStorage.getItem("excelDataset");
    if (fileString) {
      // sets string repreentation of array buffer to array bufffer
      const file = new Uint8Array(fileString.split(",")).buffer;
      setExcelDataset(file);
    } else {
      setExcelDataset(null);
    }
  }, []);

  useEffect(() => {
    if (config && excelDataset) {
      //updates cyytoscape state to include node and edge data and creates gantchart data
      async function addDataToCytoscape() {
        const {
          cyElms,
          gantChartItems,
          activityData,
          dates,
          stakeholderData,
          latestPrPeriod,
          maxEngScore,
          missingFieldWarning,
        } = await makeVisElements(prPeriod, currentStory, completedDisplay, config, excelDataset); //all pre-processing of data

        actDataRef.current = activityData; //asigns activity data to ref
        stakeholderDataRef.current = stakeholderData;
        datesRef.current = dates; //assigns dates ro ref
        gantchartDataRef.current = gantChartItems; //asign gant chart data to the ref
        latestPrPeriodRef.current = latestPrPeriod;
        engagementScoresRef.current = maxEngScore; // gives default maxEngScore

        setFieldWarning(missingFieldWarning);
        setCyState((prevState) => ({
          ...prevState,
          elements: cyElms,
          display: "block",
        }));
      }

      addDataToCytoscape();
    }
  }, [completedDisplay, cyState.cy, cyState.elements.length, prPeriod, currentStory, config, excelDataset]);

  //---------------------- STYLE -------------------------------------

  // HIDE SIDE PANNEL (bug in splitpane so this is best option)
  document.querySelectorAll(".Pane2").forEach((el) => {
    el.style.display = selectedNode.id === "" ? "none" : "block";
  });

  const veiwStyle = {
    opacity: uploadVeiw ? 0.2 : 1.0,
    // filter: "brightness(50%)",
    pointerEvents: uploadVeiw ? "none" : "all",
  };

  const openUploadVeiw = (evt) => {
    setUploadVeiw((prevState) => !prevState);
    setUserFiles({
      config: { fileName: null, errors: null },
      dataset: { fileName: null, errors: null },
    });
  };

  if (config && excelDataset) {
    return (
      <div className="container">
        <div className="Resizer">
          <SplitPane split="vertical" minSize={"20em"} defaultSize={"20em"} allowResize={true} primary="second">
            <div>
              <div style={veiwStyle}>
                <div className="top-layer">
                  {fieldWarning && warningBarDisplay && Object.keys(fieldWarning).length > 0 && (
                    <WarningBar fieldWarning={fieldWarning} setWarningBarDisplay={setWarningBarDisplay} />
                  )}
                  <div className="headSection">
                    <div className="rightSide">
                      <Header
                        cyState={cyState}
                        datesRef={datesRef}
                        prPeriod={prPeriod}
                        currentStory={currentStory}
                        completedDisplay={completedDisplay}
                        networkVeiw={networkVeiw}
                        warningBarDisplay={warningBarDisplay}
                        setWarningBarDisplay={setWarningBarDisplay}
                        fieldWarning={fieldWarning}
                      />
                      {!uploadVeiw && (
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
                      )}
                      <Legend
                        cyState={cyState}
                        networkVeiw={networkVeiw}
                        selectedNode={selectedNode}
                        networkVeiwEls={networkVeiwEls}
                        engScoreVeiw={engScoreVeiw}
                        stakeholdersDisplay={stakeholdersDisplay}
                      />
                    </div>
                    {!uploadVeiw && (
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
                        completedDisplay={completedDisplay}
                        stakeholdersDisplay={stakeholdersDisplay}
                        selectedNode={selectedNode}
                        engScoreVeiw={engScoreVeiw}
                        setEngeScoreVeiw={setEngeScoreVeiw}
                        setCustomStoryDisplay={setCustomStoryDisplay}
                      />
                    )}
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

              {uploadVeiw && (
                <Upload userFiles={userFiles} setUserFiles={setUserFiles} setExcelDataset={setExcelDataset} />
              )}

              <div className="zoomButtons">
                <button onClick={openUploadVeiw}>
                  Upload new files <i className="fa fa-upload"></i>
                </button>
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
  } else {
    return <Upload userFiles={userFiles} setUserFiles={setUserFiles} setExcelDataset={setExcelDataset} />;
  }
}

export default App;
