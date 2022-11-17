import { FCOSE } from "../cytoscape/functions/LAYOUTS";

import "./ToggleButtons.css";

export function ToggleButtons({
  selectedBottomVis,
  setSelectedBottomVis,
  setConnectionFlagsDisplay,
  connectionFlagsDisplay,
  setStakeholdersDisplay,
  currentActNodeCountRef,
  origionalActCountRef,
  setActivityEdgeDisplay,
  setCompletedDisplay,
  cyState,
  setNetworkVeiw,
  networkVeiw,
}) {
  // TOGGLE CONTROLS /////////////
  function changeLayout() {
    cyState.cy.layout(FCOSE(currentActNodeCountRef.current, origionalActCountRef.current, true)).run();
  }

  const toggleCompleted = (event) => {
    event.target.classList.toggle("activeButton");
    setCompletedDisplay((prevState) => !prevState);
  };
  //hides/displays wpedges/ activity edges when button is clicked
  const toggleEdges = (event) => {
    event.target.classList.toggle("activeButton");
    setActivityEdgeDisplay((prevState) => !prevState);
  };

  const toggleNetworkVeiw = (event) => {
    // event.target.classList.toggle("activeButton");
    setNetworkVeiw((prevState) => !prevState);
  };

  const toggleStakeholders = (event) => {
    event.target.classList.toggle("activeButton");
    cyState.cy.nodes("[type = 'stakeholderNode'] ").removeClass("show"); // remove any unwanted classes from stakeholder nodes
    setStakeholdersDisplay((prevState) => !prevState);
    // cyState.cy.layout(LAYOUTS.FCOSERandom).run();
  };

  const toggleBottomPannelDisplay = (event) => {
    const target = event.currentTarget.id;
    setSelectedBottomVis((prevState) => (prevState === target ? "" : target)); //if the same button is  clicked twice set state to ""
  };
  // TOGGLE CONTROLS /////////////

  //STYLING //////////////////////

  // const networkButtonStyle = {
  //   backgroundColor
  // }

  const style = (state) => ({
    backgroundColor: state ? " #cfcfcf" : "#e4e4e4",
  });

  //STYLING //////////////////////
  return (
    <div className="displayButtons">
      <div className="cytoscapeButtons">
        <button onClick={changeLayout}>
          Change Layout <i className="fa fa-repeat"></i>
        </button>
        <button style={style(networkVeiw)} onClick={toggleNetworkVeiw}>
          Network <i className="fa fa-circle-nodes"></i>
        </button>
        {/* <button title="flag activities with less than mean number of connections" onClick={toggleConnectionFlags}>
          Mean Connection Flag
        </button> */}
        <button
          id="gantChartButton"
          onClick={toggleBottomPannelDisplay}
          style={style(selectedBottomVis === "gantChartButton")}
        >
          Gantt Chart <i className="fa fa-chart-gantt"></i>
        </button>
        <button
          id="vegaAnalyticsButton"
          onClick={toggleBottomPannelDisplay}
          style={style(selectedBottomVis === "vegaAnalyticsButton")}
        >
          Analytics <i className="fa fa-chart-column"></i>
        </button>
      </div>
      <div className="toggleButtons">
        <button onClick={toggleEdges}>
          Toggle Connections <i className="fa fa-diagram-project"></i>
        </button>
        <button onClick={toggleCompleted}>
          Toggle Completed <i className="fa fa-check"></i>
        </button>
        <button onClick={toggleStakeholders}>
          {" "}
          Toggle Stakeholders <i className="fa fa-handshake-simple"></i>
        </button>
      </div>
      {/* <div className="bottomPannelButtons"></div> */}
    </div>
  );
}

export default ToggleButtons;

// const toggleConnectionFlags = (event) => {
//   event.target.classList.toggle("activeButton");
//   setConnectionFlagsDisplay((prevState) => !prevState);
// };

// every time button is clicked the style of flagged activities is chnaged
// useEffect(() => {
//   const nodeEdges = cyState.cy.nodes('[type = "activityNode"]').map((node) => node.connectedEdges().length);
//   const meanEdges = nodeEdges.reduce((a, b) => a + b, 0) / nodeEdges.length; //gets average edges per node
//   if (connectionFlagsDisplay === true) {
//     cyState.cy
//       .nodes('[type = "activityNode"]')
//       .map((node) => node.connectedEdges().length < meanEdges && node.addClass("lowConnections"));
//   } else {
//     cyState.cy.nodes('[type = "activityNode"]').removeClass("lowConnections");
//   }
// }, [connectionFlagsDisplay, cyState.cy]);
