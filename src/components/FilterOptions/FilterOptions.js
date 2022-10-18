import { useEffect, useState } from "react";
import STORIES from "../../configs/stories";

import CustomStory from "./customStory/CustomStroy";

import "./FilterOptions.css";

export function FilterOptions({ cyState, datesRef, prPeriod, setPrPeriod, currentStory, setCurrentStory, actDataRef }) {
  const [filterOptionsDisplay, setFilterOptionsDisplay] = useState(false);
  const [prSectionDisplay, setPrSectionDisplay] = useState(false);
  const [storySectionDisplay, setStorySectionDisplay] = useState(false);
  const [customStoryDisplay, setCustomStoryDisplay] = useState(false);

  const [stories, setStories] = useState(STORIES);
  const [customStory, setCustomStory] = useState({ name: "", ids: [], custom: true });

  console.log(customStory);

  const localStories = JSON.parse(window.localStorage.getItem("customStory"));

  const prOptions = datesRef.current !== null && [...new Set(datesRef.current.map((p) => p.prPeriod))];

  const currentPr = findCurrentPrperiod(prOptions, datesRef);
  const maxPr = prOptions[prOptions.length - 1];

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

  //STYLING //////////////////////

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
        pr: prevState.pr >= maxPr ? maxPr : prevState.pr + 1,
      }));
    } else if (event.currentTarget.id === "backButton") {
      setPrPeriod((prevState) => ({
        ...prevState,
        pr: prevState.pr <= 1 ? 1 : prevState.pr - 1,
      }));
    }
  };

  //adds teh new story to the story state to update list and adds the story to local storage (so next time page is loaded the stories are added to state automatically)
  const addCustomStoryToList = (event) => {
    setStories((prevState) => [...prevState, customStory]); //adds the new story to the list of stories
    if (localStories === null) {
      window.localStorage.setItem("customStory", JSON.stringify([customStory]));
    } else {
      window.localStorage.setItem("customStory", JSON.stringify([...localStories, customStory]));
    }
    setCustomStory({ name: "", ids: [], custom: true }); // resets the custom story to empty
    setCustomStoryDisplay(false); //hides the current stroy options
  };

  const resetFilter = (event) => {
    setPrPeriod({ pr: null, undefined: true });
    setCurrentStory(null);
    setPrSectionDisplay(false); //hides open prperiod optons when filter optiosn is clicked
    setStorySectionDisplay(false);
    setCustomStory({ name: "", ids: [], custom: true });
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

  //colors current PR period in red
  const radioLableStyle = (i) => {
    return { color: currentPr === i + 1 ? "red" : "balck" };
  };

  const prRadio =
    datesRef.current !== null &&
    prOptions.map((opt, i) => (
      <div className="radioGroup" key={opt}>
        <label htmlFor="prPeriod" style={radioLableStyle(i)}>
          {opt}
        </label>
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
      <div style={optionsStyle}>{/* <CustomFilter actDataRef={actDataRef} cyState={cyState} /> */}</div>
      <div style={optionsStyle}>
        <button onClick={displayPrOptions} className="filterOptionButton">
          Progress Report Period
          {prSectionDisplay ? <i className="fa fa-angle-up"></i> : <i className="fa fa-angle-down"> </i>}
        </button>
        <div style={prStyle}>
          <div className="undefinedCheck">
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
            <a href={"data:text/csv;charset=utf-8," + escape(convertToCSV(stories))} download="stories">
              {/* allows stories to be downloaded as csv*/}
              <button className="customStoryButton">Export Stories</button>
            </a>
          </div>
          <CustomStory
            stories={stories}
            currentStory={currentStory}
            customStoryDisplay={customStoryDisplay}
            customStory={customStory}
            setCustomStory={setCustomStory}
            cyState={cyState}
            actDataRef={actDataRef}
          />
          <button onClick={addCustomStoryToList} style={addStoryButtonStyle} className="customStoryButton">
            Add
          </button>
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
  //checks in=f todays date is between start and end dates of each pr period and returns pr period
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
