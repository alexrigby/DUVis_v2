import Timeline from "react-vis-timeline-2";
import "./Gantchart.css";

import styleSelectedElements from "../../cytoscape/functions/styleSelectedElements";
import { useEffect } from "react";

export function Gantchart({ gantchartData, cyState, setSelectedNode, selectedBottomVis }) {
  function itemClickHandler(props) {
    props.item !== null &&
      setSelectedNode((prevState) =>
        props.item === prevState.id ? { id: "" } : cyState.cy.nodes(`#${props.item}`).data()
      );

    styleSelectedElements(cyState.cy, props.item);
  }

  // CANT THINK OF BETTER STATE SOLUTION!!
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
