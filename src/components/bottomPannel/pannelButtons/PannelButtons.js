import "./PannelButtons.css";

export function PannelButtons({ buttonsUp, setButtonsUp }) {
  const toggleGantchartDisplay = () => {
    //CANT THINK OF STATE SOLUTION!!
    const timeline = document.querySelectorAll(".vis-timeline");
    timeline.forEach((el) => {
      el.classList.toggle("show");
    });
    setButtonsUp((prevState) => !prevState);
  };
  const buttonArrow = buttonsUp ? <i className="fa fa-angle-down"></i> : <i className="fa fa-angle-up"></i>;

  const style = { position: buttonsUp ? "absolute" : "static" };
  return (
    <div className="pannelButtons">
      <button onClick={toggleGantchartDisplay}>Gantt Chart {buttonArrow}</button>
      <button>Analytics {buttonArrow}</button>
    </div>
  );
}

export default PannelButtons;
