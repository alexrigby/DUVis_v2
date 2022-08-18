import React, { useState } from "react";

import Timeline from "react-vis-timeline-2";
import "./Gantchart.css";

export function Gantchart({ gantchartData }) {
  //   const [gantchartDisplay, setGantchartDisplay] = useState(false);

  //   const toggleGantchartDisplay = () => {
  //     setGantchartDisplay((prevState) => !prevState);
  //   };

  const options = {
    stack: true,
    showMajorLabels: true,
    showCurrentTime: true,
    verticalScroll: true,
    zoomMin: 1000000,
    type: "range",
    // maxHeight: "1300px",
  };

  //   const style = {
  //     display: gantchartDisplay ? "block" : "none",
  //   };

  if (gantchartData.current !== null) {
    console.log("helllo");
    return (
      <div>
        <div className="gantchart">
          <button className="gantchartDisplayButton">
            Gantt Chart
            <i className="fa fa-angle-down"></i>
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
