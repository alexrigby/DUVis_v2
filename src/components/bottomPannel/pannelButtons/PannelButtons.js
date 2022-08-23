import "./PannelButtons.css";

export function PannelButtons({ selectedBottomVis, setSelectedBottomVis }) {
  const toggleGantchartDisplay = (event) => {
    const target = event.currentTarget.id;
    setSelectedBottomVis((prevState) => (prevState === target ? "" : target)); //if the same button is  clicked twice set state to ""
  };

  const gantButtonArrow =
    selectedBottomVis === "gantChartButton" ? <i className="fa fa-angle-down"></i> : <i className="fa fa-angle-up"></i>;
  const vegaButtonArrow =
    selectedBottomVis === "vegaAnalyticsButton" ? (
      <i className="fa fa-angle-down"></i>
    ) : (
      <i className="fa fa-angle-up"></i>
    );

  return (
    <div className="pannelButtons">
      <button onClick={toggleGantchartDisplay} id="gantChartButton">
        Gantt Chart {gantButtonArrow}
      </button>
      <button onClick={toggleGantchartDisplay} id="vegaAnalyticsButton">
        Analytics {vegaButtonArrow}
      </button>
    </div>
  );
}

export default PannelButtons;
