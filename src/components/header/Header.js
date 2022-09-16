import "./Header.css";
import LAYOUTS from "../cytoscape/functions/cyLayouts";
import STORIES from "../../configs/stories";
import { useState } from "react";

export function Header({
  cyState,
  datesRef,
  setPrPeriod,
  prPeriod,
  setCurrentStory,
  currentStory,
  setActivityEdgeDisplay,
  setCompletedDisplay,
}) {
  const [filterOptionsDisplay, setFilterOptionsDisplay] = useState(false);
  const [prSectionDisplay, setPrSectionDisplay] = useState(false);
  const [storySectionDisplay, setStorySectionDisplay] = useState(false);
  const [customStoryDisplay, setCustomStoryDisplay] = useState(false);

  const [stories, setStories] = useState(STORIES);
  const [customStory, setCustomStory] = useState({ name: "", ids: [] });

  const prOptions = datesRef.current !== null && [...new Set(datesRef.current.map((p) => p.prPeriod))];

  // TOGGLE CONTROLS /////////////
  function changeLayout() {
    cyState.cy.layout(LAYOUTS.FCOSERandom).run();
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
  // TOGGLE CONTROLS /////////////

  //FILTER OPTIONS DISPLAY CONTROLS /////////////
  const displayFilterOptions = (event) => {
    setFilterOptionsDisplay((prevState) => !prevState);
  };

  const displayStoryOptions = (event) => {
    setStorySectionDisplay((prevState) => !prevState);
  };

  const displayCustomStoryOptions = (event) => {
    //  setPrPeriod({ pr: null, undefined: true });
    setCurrentStory(null); // so all nodes are available to select from to make custom story
    setCustomStoryDisplay((prevState) => !prevState);
  };

  const displayPrOptions = (event) => {
    setPrSectionDisplay((prevState) => !prevState);
    setPrPeriod((prevState) => ({
      ...prevState,
      pr: prevState.pr === null ? prOptions.length : null,
    }));
    //resets proptons when button is clicked
  };
  //FILTER OPTIONS DISPLAY CONTROLS /////////////

  //STYLING //////////////////////
  const optionsStyle = {
    display: filterOptionsDisplay ? "block" : "none",
  };
  const storyStyle = {
    display: storySectionDisplay ? "block" : "none",
  };
  const prStyle = {
    display: prSectionDisplay ? "flex" : "none",
  };

  const resetStyle = {
    display: prPeriod.pr === null && currentStory === null ? "none" : "inline-block",
  };

  const addStoryButtonStyle = {
    display: customStory.ids.length === 0 || customStory.name === "" ? "none" : "flex",
  };

  const selectedStoryStyle = (storyName) => {
    if (currentStory !== null && currentStory.name === storyName) {
      return { color: "grey" };
    }
  };

  const customStoryStyle = () => {
    if (currentStory === null && customStoryDisplay === true) {
      return { display: "flex" };
    } else {
      return { display: "none" };
    }
  };
  //STYLING //////////////////////

  //sets prperod to selected radio button
  const prClickHandler = (event) => {
    if (prPeriod.pr === null) {
      setPrPeriod((prevState) => ({
        pr: event.target.type === "radio" ? parseFloat(event.target.value) : null,
        undefined: event.target.type === "checkbox" ? !prevState.undefined : prevState.undefined,
      }));
    } else {
      setPrPeriod((prevState) => ({
        pr: event.target.type === "radio" ? parseFloat(event.target.value) : prevState.pr,
        undefined: event.target.type === "checkbox" ? !prevState.undefined : prevState.undefined,
      }));
    }
  };

  //allows user to set pr period using the arrow buttons
  const scrollHandler = (event) => {
    // console.log(event.currentTarget.id);
    if (event.currentTarget.id === "forwardButton") {
      setPrPeriod((prevState) => ({
        ...prevState,
        pr: prevState.pr >= 13 ? 13 : prevState.pr + 1,
      }));
    } else if (event.currentTarget.id === "backButton") {
      setPrPeriod((prevState) => ({
        ...prevState,
        pr: prevState.pr <= 1 ? 1 : prevState.pr - 1,
      }));
    }
  };

  const addCustomStoryName = (event) => {
    if (event.target.type === "button") {
      setCustomStory((prevState) => ({ ...prevState, name: document.getElementById("customName").value }));
    } else {
      event.keyCode === 13 && setCustomStory((prevState) => ({ ...prevState, name: event.target.value }));
    } // key code 13 === 'enter'
  };

  const addCustomStoryId = (event) => {
    if (event.target.type === "button") {
      setCustomStory((prevState) => ({
        ...prevState,
        ids: checkForDuplicateIds(document.getElementById("customId").value, prevState.ids),
      }));
    } else {
      event.keyCode === 13 &&
        setCustomStory((prevState) => ({
          ...prevState,
          ids: checkForDuplicateIds(event.target.value, prevState.ids),
        }));
    }
  };

  const addCustomStoryToList = (event) => {
    setStories((prevState) => [...prevState, customStory]); //ads the new story to the list of stories
    setCustomStory({ name: "", ids: [] }); // resets the custom story to empty
    setCustomStoryDisplay(false); //hides the current stroy options
  };

  const resetFilter = (event) => {
    setPrPeriod({ pr: null, undefined: true });
    setCurrentStory(null);
    setPrSectionDisplay(false); //hides open prperiod optons when filter optiosn is clicked
    setStorySectionDisplay(false);
    setCustomStory({ name: "", ids: [] });
  };

  const storyClickHandler = (event) => {
    setCustomStoryDisplay(false);
    //set stte to array of id inn that story
    setCurrentStory({ ids: event.target.dataset.ids.split(",").map((i) => Number(i)), name: event.target.title });
  };

  const storyOptions = stories.map((story, i) => (
    <p
      key={story.name}
      title={story.name}
      data-ids={story.ids}
      style={selectedStoryStyle(story.name)}
      onClick={storyClickHandler}
    >
      {i + 1}. {story.name}
    </p>
  ));
  const optionHoverHandler = (event) => {
    console.log(event.target.value);
  };
  const prRadio =
    datesRef.current !== null &&
    prOptions.map((opt, i) => (
      <div className="radioGroup" key={opt}>
        <label htmlFor="prPeriod">{opt}</label>
        <input
          type="radio"
          id={opt}
          name="prPeriod"
          value={opt}
          onChange={prClickHandler}
          checked={prPeriod.pr !== null && prPeriod.pr - 1 === i} //check the current pr period
        ></input>
      </div>
    ));

  const sortedNodes =
    cyState.cy !== null && cyState.cy.nodes("[type = 'activityNode']").sort((a, b) => a.id() - b.id()); //sorts nodes in oredr of ID

  const idSelectOptions =
    cyState.cy !== null &&
    sortedNodes.map((node) => (
      <option value={node.id()} key={node.id()} onMouseEnter={optionHoverHandler}>
        {node.id()}
      </option>
    ));

  return (
    <header>
      <div className="topLine">
        <h1>Dwr Uisce Work Package Visualiser</h1>
        <div className="displayButtons">
          <button onClick={changeLayout}>Change Layout </button>
          <button onClick={toggleEdges}>Toggle Connections</button>
          <button onClick={toggleCompleted}>Toggle Completed </button>
        </div>
      </div>
      <p className="subHeader">
        {currentStory === null ? "All Activities" : currentStory.name}
        {" || "}
        {datesRef.current !== null && prStartAndEndDate(datesRef, prPeriod).start} -{" "}
        {datesRef.current !== null && prStartAndEndDate(datesRef, prPeriod).end}
      </p>

      <div>
        <div>
          <button onClick={displayFilterOptions}>
            Filter Activities
            {filterOptionsDisplay ? <i className="fa fa-angle-up"></i> : <i className="fa fa-angle-down"> </i>}
          </button>
          <button onClick={resetFilter} style={resetStyle}>
            Reset
          </button>
        </div>
        <div style={optionsStyle}>
          <button onClick={displayPrOptions} className="filterOptionButton">
            Progress Report Period
            {prSectionDisplay ? <i className="fa fa-angle-up"></i> : <i className="fa fa-angle-down"> </i>}
          </button>
          <div className="undefinedCheck" style={prStyle}>
            <label htmlFor="prPeriod">Include Undefined</label>
            <input
              type="checkBox"
              id="undef"
              name="prPeriod"
              value="undef"
              onChange={prClickHandler}
              defaultChecked={true}
            ></input>
          </div>
          <div className="prSelection" style={prStyle}>
            {prRadio}
            <button id="backButton" onClick={scrollHandler}>
              <i className="fa fa-angles-left"></i>
            </button>
            <button id="forwardButton" onClick={scrollHandler}>
              <i className="fa fa-angles-right"></i>
            </button>
          </div>
        </div>
        <div style={optionsStyle}>
          <button onClick={displayStoryOptions} className="filterOptionButton">
            Stories {storySectionDisplay ? <i className="fa fa-angle-up"></i> : <i className="fa fa-angle-down"> </i>}
          </button>
          <div className="storyFilter" style={storyStyle}>
            <div className="storyOptions">
              {storyOptions}
              <button className="customStoryButton" onClick={displayCustomStoryOptions}>
                Custom Story
              </button>
            </div>
            <div className="customStorySection" style={customStoryStyle()}>
              <div className="customStoryInput">
                <input id="customName" name="customStory" placeholder="story name" onKeyUp={addCustomStoryName}></input>
                <button type="button" onClick={addCustomStoryName}>
                  <i className="fa-solid fa-plus"></i>
                </button>
              </div>
              <div className="customStoryInput">
                <select
                  id="customId"
                  name="customStory"
                  onKeyUp={addCustomStoryId}
                  onKeyDown={(e) => e.preventDefault()} //prevents 'enter' opening select dropdown
                >
                  {idSelectOptions}
                </select>
                <button type="button" onClick={addCustomStoryId}>
                  <i className="fa-solid fa-plus"></i>
                </button>
              </div>
              <p className="customStoryName">Name: {customStory.name !== "" && customStory.name}</p>
              <p className="customStoryIds">Activities: {customStory.ids.length !== 0 && String(customStory.ids)}</p>
            </div>
            <button onClick={addCustomStoryToList} style={addStoryButtonStyle} className="customStoryButton">
              Add
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;

// converts dates to nice format
function prStartAndEndDate(datesRef, prPeriod) {
  const pr = prPeriod.pr === null ? datesRef.current[datesRef.current.length - 1].prPeriod : prPeriod.pr;
  const prDates = datesRef.current.filter((date) => pr === date.prPeriod);

  const start = String(
    new Date(datesRef.current[0].date).toLocaleDateString("en-GB", { month: "short", year: "numeric" })
  );
  const end = String(
    new Date(prDates[prDates.length - 1].date).toLocaleDateString("en-GB", {
      month: "short",
      year: "numeric",
    })
  );
  return {
    start: start,
    end: end,
  };
}

//prevents 2 of the same ids being chosen
function checkForDuplicateIds(newId, prevIds) {
  if (prevIds.length === 0) {
    return [newId];
  } else {
    if (prevIds.includes(newId)) {
      return [...prevIds];
    } else {
      return [...prevIds, newId];
    }
  }
}
