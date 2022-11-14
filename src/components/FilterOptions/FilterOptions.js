import { useEffect, useState } from "react";
import STORIES from "../../configs/stories";

import CustomStory from "./customStory/CustomStory";
import PRScroll from "./PRScroll/PRScroll";

import "./FilterOptions.css";

export function FilterOptions({
  datesRef,
  prPeriod,
  setPrPeriod,
  currentStory,
  setCurrentStory,
  actDataRef,
  matrixHeadersRef,
}) {
  const [filterOptionsDisplay, setFilterOptionsDisplay] = useState(false);
  const [prSectionDisplay, setPrSectionDisplay] = useState(false);
  const [storySectionDisplay, setStorySectionDisplay] = useState(false);
  const [customStoryDisplay, setCustomStoryDisplay] = useState(false);

  const [stories, setStories] = useState(STORIES);
  const [customStoryFilter, setCustomStoryFilter] = useState([{ field: "", values: [] }]);
  const [customStory, setCustomStory] = useState({ name: "", ids: [], custom: true });

  const localStories = JSON.parse(window.localStorage.getItem("customStory"));

  const prOptions = datesRef.current !== null && [...new Set(datesRef.current.map((p) => p.prPeriod))];

  const currentPr = findCurrentPrperiod(prOptions, datesRef);

  //runs fist time component is loaded - checks for data in local storage and adds it to the stories state
  useEffect(() => {
    if (localStories !== null) {
      setStories((prevState) => [...prevState, ...localStories]);
    }
  }, []);

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
      pr: prevState.pr === null ? currentPr : null,
    }));
    //resets proptons when button is clicked
  };
  //FILTER OPTIONS DISPLAY CONTROLS /////////////

  //STYLING //////////////////////
  const optionsStyle = {
    display: filterOptionsDisplay ? "block" : "none",
  };
  const storyStyle = {
    display: storySectionDisplay ? "contents" : "none",
  };

  const resetStyle = {
    display: prPeriod.pr === null && currentStory === null ? "none" : "inline-block",
  };

  const selectedStoryStyle = (storyName) => {
    if (currentStory !== null && currentStory.name === storyName) {
      return { color: "grey" };
    }
  };
  //STYLING //////////////////////

  const resetFilter = (event) => {
    setPrPeriod({ pr: null, undefined: true });
    setCurrentStory(null);
    setPrSectionDisplay(false); //hides open prperiod optons when filter optiosn is clicked
    setStorySectionDisplay(false);
    setCustomStory({ name: "", ids: [], custom: true });
    setCustomStoryFilter([{ field: "", values: [] }]);
  };

  const storyClickHandler = (event) => {
    setCustomStoryDisplay(false);
    //set stte to array of id inn that story
    setCurrentStory({ ids: event.target.dataset.ids.split(",").map((i) => Number(i)), name: event.target.title });
    // cyState.cy.layout(LAYOUTS.FCOSE).run();
  };

  const deleteCustomStory = (event) => {
    const newLocalArray = localStories.filter((story) => story.name !== event.target.dataset.storyname); // filter by storyname of deleted click
    setStories([...STORIES, ...newLocalArray]); //reset story state to the new array of local storage and the default storys
    currentStory !== null &&
      setCurrentStory((prevState) => (prevState.name === event.target.dataset.storyname ? null : prevState)); // set current story to null so when story is deleted if it is selected
    window.localStorage.setItem("customStory", JSON.stringify([...newLocalArray])); //set the new array minus deleted story to local storage
  };

  const storyOptions = stories.map((story, i) => {
    return (
      <div key={story.name}>
        <p title={story.name} data-ids={story.ids} style={selectedStoryStyle(story.name)} onClick={storyClickHandler}>
          {i + 1}. {story.name}
        </p>{" "}
        <p>
          {story.custom === true && (
            <i onClick={deleteCustomStory} data-storyname={story.name} className="fa fa-trash"></i> // if it is a custom story then add delete icon to it
          )}
        </p>
      </div>
    );
  });

  return (
    <div className="filterOptions">
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
        <PRScroll
          setPrPeriod={setPrPeriod}
          currentPr={currentPr}
          prPeriod={prPeriod}
          datesRef={datesRef}
          prOptions={prOptions}
          prSectionDisplay={prSectionDisplay}
        />
      </div>
      <div style={optionsStyle}>
        <button onClick={displayStoryOptions} className="filterOptionButton">
          Stories {storySectionDisplay ? <i className="fa fa-angle-up"></i> : <i className="fa fa-angle-down"> </i>}
        </button>
        <div className="storyFilter" style={storyStyle}>
          <div className="storyOptions">
            {storyOptions}
            <button className="customStoryButton" onClick={displayCustomStoryOptions}>
              Custom Story <i className="fa fa-pencil"></i>
            </button>
            <a href={"data:text/csv;charset=utf-8," + escape(convertToCSV(stories))} download="stories">
              {/* allows stories to be downloaded as csv*/}
              <button className="customStoryButton">
                Export Stories <i className="fa fa-download"></i>
              </button>
            </a>
          </div>
          <CustomStory
            stories={stories}
            currentStory={currentStory}
            customStoryDisplay={customStoryDisplay}
            setCustomStory={setCustomStory}
            actDataRef={actDataRef}
            customStoryFilter={customStoryFilter}
            setCustomStoryFilter={setCustomStoryFilter}
            setStories={setStories}
            customStory={customStory}
            setCustomStoryDisplay={setCustomStoryDisplay}
            localStories={localStories}
            matrixHeadersRef={matrixHeadersRef}
          />
        </div>
      </div>
    </div>
  );
}

export default FilterOptions;

const convertToCSV = (data) => {
  // Convert dataset to TSV and print
  const headers = Object.keys(data[0]);
  const csv = [headers.join(","), ...data.map((row) => headers.map((fieldName) => row[fieldName]).join(","))].join(
    "\r\n"
  );

  return csv;
};

function findCurrentPrperiod(prOptions, datesRef) {
  const pr = [];
  //splits up dates into prperiods
  for (let i = 0; i < prOptions.length; i++) {
    pr.push(datesRef.current.filter((d) => d.prPeriod === prOptions[i]));
  }
  //checks if todays date is between start and end dates of each pr period and returns pr period
  var currentPr = {};
  for (let i = 0; i < pr.length; i++) {
    if (
      new Date().getTime(pr[i][0].date) <= new Date().getTime() &&
      new Date().getTime() <= new Date(pr[i][pr[i].length - 1].date).getTime()
    ) {
      currentPr.currentPr = pr[i][0].prPeriod;
    }
  }
  return currentPr.currentPr;
}
