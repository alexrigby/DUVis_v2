import Timeline from "react-vis-timeline-2";
import "./Gantchart.css";

export function Gantchart({ gantchartData }) {
  console.log(gantchartData.current);
  const options = {
    width: "100%",
    height: "100px",
    stack: true,
    showMajorLabels: true,
    showCurrentTime: true,
    zoomMin: 1000000,
    type: "background",
    format: {
      minorLabels: {
        minute: "h:mma",
        hour: "ha",
      },
    },
  };

  if (gantchartData.current !== null) {
    return (
      <div className="gantchart">
        <Timeline
          initialOptions={options}
          initialGroups={gantchartData.current.groups}
          initialItems={gantchartData.current.items}
        />
      </div>
    );
  }
}

export default Gantchart;
