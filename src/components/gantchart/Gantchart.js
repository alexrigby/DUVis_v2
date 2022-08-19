import React, { useState, useRef, useEffect } from "react";

import Timeline from "react-vis-timeline-2";
import "./Gantchart.css";

import styleSelectedElements from "../cytoscape/functions/styleSelectedElements";

export function Gantchart({ gantchartData, cyState, setSelectedNode }) {
  // const [gantchartDisplay, setGantchartDisplay] = useState(false);
  const [buttonUp, setbuttonUp] = useState(false);

  const buttonBottom = {
    position: "absolute",
    bottom: "0",
    left: "0",
  };

  const buttonArrow = buttonUp ? <i className="fa fa-angle-down"></i> : <i className="fa fa-angle-up"></i>;

  const toggleGantchartDisplay = () => {
    //CANT THINK OF STATE SOLUTION!!
    const timeline = document.querySelectorAll(".vis-timeline");
    timeline.forEach((el) => {
      el.classList.toggle("show");
    });
    setbuttonUp((prevState) => !prevState);

    // setGantchartDisplay((prevState) => !prevState);
  };

  function itemClickHandler(props) {
    props.item !== null &&
      setSelectedNode((prevState) =>
        props.item === prevState.id ? { id: "" } : cyState.cy.nodes(`#${props.item}`).data()
      );

    styleSelectedElements(cyState.cy, props.item);
  }

  const options = {
    stack: true,
    showMajorLabels: true,
    showCurrentTime: true,
    verticalScroll: true,
    zoomMin: 1000000000,
    type: "range",
    margin: {
      item: {
        horizontal: 2,
        vertical: 5,
      },
      axis: 6,
    },
    maxHeight: 1300,
  };

  if (gantchartData.current !== null) {
    return (
      <div>
        <div className="gantchart">
          <button
            className="gantchartDisplayButton"
            style={buttonUp ? null : buttonBottom}
            onClick={toggleGantchartDisplay}
          >
            Gantt Chart{buttonArrow}
          </button>
          <div>
            <Timeline
              clickHandler={itemClickHandler}
              options={options}
              initialGroups={gantchartData.current.groups}
              initialItems={gantchartData.current.items}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Gantchart;
