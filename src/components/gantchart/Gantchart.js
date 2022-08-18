import React, { useState } from "react";

import Timeline from "react-vis-timeline-2";
import "./Gantchart.css";

export function Gantchart({ gantchartData }) {
  // const [gantchartDisplay, setGantchartDisplay] = useState(false);

  const toggleGantchartDisplay = () => {
    const timeline = document.querySelectorAll(".vis-timeline");
    timeline.forEach((el) => {
      el.classList.toggle("show");
    });

    const button = document.querySelectorAll(".gantchartDisplayButton");

    button.forEach((el) => {
      el.classList.toggle("bottom");
    });

    // setGantchartDisplay((prevState) => !prevState);
  };

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

  // const style = {
  //   visibility: gantchartDisplay ? "visible !important" : "hidden !important",
  // };

  if (gantchartData.current !== null) {
    console.log("component rerendered");
    return (
      <div>
        <div className="gantchart">
          <button className="gantchartDisplayButton bottom" onClick={toggleGantchartDisplay}>
            Gantt Chart
            <i className="fa fa-angle-up"></i>
          </button>
          <div>
            <Timeline
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
