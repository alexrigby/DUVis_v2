import Timeline from "react-vis-timeline-2";
import "./GanttChart.css";

import styleSelectedElements from "../../cytoscape/functions/styleSelectedElements";
import { useEffect, useRef } from "react";

export function GanttChart({ gantchartDataRef, cyState, setSelectedNode, selectedBottomVis, datesRef }) {
  //sets ref to get access to timelineAPI
  const ganttChartRef = useRef(null);

  //when an item is clicked on the gantt chart it updates selected node id as well
  function itemClickHandler(props) {
    if (props.item !== null) {
      setSelectedNode((prevState) =>
        props.item === prevState.id ? { id: "" } : cyState.cy.nodes(`#${props.item}`).data()
      );
      styleSelectedElements(cyState.cy, props.item);
    }
  }

  // Hard to acces gantt chart items style
  useEffect(() => {
    const timeline = document.querySelectorAll(".vis-timeline");
    if (selectedBottomVis === "gantChartButton") {
      timeline.forEach((el) => {
        el.classList.add("show");
      });
    } else {
      timeline.forEach((el) => {
        el.classList.remove("show");
      });
    }
  }, [selectedBottomVis]);

  const options = {
    start: datesRef.current !== null ? new Date(datesRef.current[0].date).getTime() : "2022-01-01",
    end:
      datesRef.current !== null ? new Date(datesRef.current[datesRef.current.length - 1].date).getTime() : "2022-03-02",
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
    maxHeight: 500,
  };

  useEffect(() => {
    if (ganttChartRef.current !== null) {
      ganttChartRef.current.timeline.setData(gantchartDataRef.current);
      ganttChartRef.current.timeline.setOptions(options);
    }
  }, [gantchartDataRef.current]);

  if (gantchartDataRef.current !== null) {
    return (
      <div>
        <div className="gantchart">
          <div>
            <Timeline clickHandler={itemClickHandler} ref={ganttChartRef} />
          </div>
        </div>
      </div>
    );
  }
}

export default GanttChart;
