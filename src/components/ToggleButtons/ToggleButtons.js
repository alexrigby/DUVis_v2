import { FCOSE } from "../cytoscape/functions/LAYOUTS";

import "./ToggleButtons.css";

export function ToggleButtons({
  selectedBottomVis,
  setSelectedBottomVis,
  setStakeholdersDisplay,
  currentActNodeCountRef,
  setActivityEdgeDisplay,
  setCompletedDisplay,
  cyState,
  setNetworkVeiw,
  networkVeiw,
  activityEdgeDisplay,
  completedDisplay,
  stakeholdersDisplay,
  selectedNode,
  engScoreVeiw,
  setEngeScoreVeiw,
  setCustomStoryDisplay,
}) {
  // TOGGLE CONTROLS /////////////
  function changeLayout() {
    !networkVeiw && cyState.cy.layout(FCOSE(currentActNodeCountRef.current, true)).run();
  }

  const toggleCompleted = (event) => {
    setCompletedDisplay((prevState) => !prevState);
  };

  //hides/displays wpedges/ activity edges when button is clicked
  const toggleEdges = (event) => {
    selectedNode.id === "" &&
      setActivityEdgeDisplay((prevState) => (prevState === "wp" ? "act" : prevState === "act" ? "none" : "wp"));
  };

  const toggleNetworkVeiw = (event) => {
    // event.target.classList.toggle("activeButton");
    setNetworkVeiw((prevState) => !prevState);
    setCustomStoryDisplay(false);
    setTimeout(() => {
      cyState.cy.fit();
    }, 1);
  };

  const toggleEngScoreVeiw = (event) => {
    setEngeScoreVeiw((prevState) => !prevState);
  };

  const toggleStakeholders = (event) => {
    setStakeholdersDisplay((prevState) => (selectedNode.type !== "stakeholderNode" ? !prevState : false));
    // cyState.cy.layout(LAYOUTS.FCOSERandom).run();
  };

  const toggleBottomPannelDisplay = (event) => {
    const target = event.currentTarget.id;
    setSelectedBottomVis((prevState) => (prevState === target ? "" : target)); //if the same button is  clicked twice set state to ""
  };
  // TOGGLE CONTROLS /////////////

  //STYLING //////////////////////

  const style = (state) => ({
    backgroundColor: state ? " #cfcfcf" : "#e4e4e4",
  });

  //STYLING //////////////////////
  return (
    <div className="displayButtons">
      <div className="cytoscapeButtons">
        <button onClick={changeLayout} title="rearrange node positions">
          Layout <i className="fa fa-repeat"></i>
        </button>
        <button onClick={toggleEdges} title="toggle connection types">
          Connections <i className="fa fa-diagram-project"></i>
        </button>
        <button
          onClick={toggleCompleted}
          style={style(completedDisplay)}
          title="grey out activities that have been completed"
        >
          Toggle completed <i className="fa fa-check"></i>
        </button>
      </div>
      <div className="toggleButtons">
        <button style={style(networkVeiw)} onClick={toggleNetworkVeiw} title="display network of the selected node">
          Network <i className="fa fa-circle-nodes"></i>
        </button>
        <button style={style(engScoreVeiw)} onClick={toggleEngScoreVeiw} title="display stakeholder engagement ranking">
          Engagement <i className="fa fa-link"></i>
        </button>
        <button
          onClick={toggleStakeholders}
          style={style(stakeholdersDisplay)}
          title="toggle stakeholder nodes display"
        >
          Stakeholders <i className="fa fa-handshake-simple"></i>
        </button>
      </div>
      <div className="toggleButtons">
        <button
          id="gantChartButton"
          onClick={toggleBottomPannelDisplay}
          style={style(selectedBottomVis === "gantChartButton")}
          title="open gantt chart pannel"
        >
          Gantt Chart <i className="fa fa-chart-gantt"></i>
        </button>
        <button
          id="vegaAnalyticsButton"
          onClick={toggleBottomPannelDisplay}
          style={style(selectedBottomVis === "vegaAnalyticsButton")}
          title="open analytics pannel"
        >
          Analytics <i className="fa fa-chart-column"></i>
        </button>
      </div>

      {/* <div className="bottomPannelButtons"></div> */}
    </div>
  );
}

export default ToggleButtons;
