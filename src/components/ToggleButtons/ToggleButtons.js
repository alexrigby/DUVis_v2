import { useContext } from "react";

import ConfigContext from "../../context/ConfigContext";
import { FCOSE } from "../cytoscape/functions/LAYOUTS";
import { projectMeta, CATEGORYS_PROVIDED } from "../../data";

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
  completedDisplay,
  stakeholdersDisplay,
  selectedNode,
  engScoreVeiw,
  setEngeScoreVeiw,
  setCustomStoryDisplay,
}) {
  const configRef = useContext(ConfigContext);

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
    <div className="toggleButtons">
      <button onClick={changeLayout} title="rearrange node positions">
        Layout <i className="fa fa-repeat"></i>
      </button>
      <button onClick={toggleEdges} title="toggle connection types">
        Connections <i className="fa fa-diagram-project"></i>
      </button>
      {configRef.current.INCLUDE_DATES && (
        <button
          onClick={toggleCompleted}
          style={style(completedDisplay)}
          title="grey out activities that have been completed"
        >
          Toggle completed <i className="fa fa-check"></i>
        </button>
      )}

      <button style={style(networkVeiw)} onClick={toggleNetworkVeiw} title="display network of the selected node">
        Network <i className="fa fa-circle-nodes"></i>
      </button>
      {/* if stakeholderds are included then allow stakeholder toggling */}
      {projectMeta.STHOLDERS && (
        <button style={style(engScoreVeiw)} onClick={toggleEngScoreVeiw} title="display stakeholder engagement ranking">
          Engagement <i className="fa fa-link"></i>
        </button>
      )}
      {projectMeta.STHOLDERS && (
        <button
          onClick={toggleStakeholders}
          style={style(stakeholdersDisplay)}
          title="toggle stakeholder nodes display"
        >
          Stakeholders <i className="fa fa-handshake-simple"></i>
        </button>
      )}

      {configRef.current.INCLUDE_DATES && (
        <button
          id="gantChartButton"
          onClick={toggleBottomPannelDisplay}
          style={style(selectedBottomVis === "gantChartButton")}
          title="open gantt chart pannel"
        >
          Gantt Chart <i className="fa fa-chart-gantt"></i>
        </button>
      )}
      {CATEGORYS_PROVIDED && (
        <button
          id="vegaAnalyticsButton"
          onClick={toggleBottomPannelDisplay}
          style={style(selectedBottomVis === "vegaAnalyticsButton")}
          title="open analytics pannel"
        >
          Analytics <i className="fa fa-chart-column"></i>
        </button>
      )}
    </div>
  );
}

export default ToggleButtons;
