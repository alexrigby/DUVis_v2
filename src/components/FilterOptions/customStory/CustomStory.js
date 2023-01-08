import { useEffect, useState } from "react";
import { actFields } from "../../../data";

import "./CustomStory.css";

export function CustomStory({
  stories,
  currentStory,
  customStoryDisplay,
  setCustomStory,
  actDataRef,
  customStoryFilter,
  setCustomStoryFilter,
  setStories,
  customStory,
  setCustomStoryDisplay,
  localStories,
  matrixHeadersRef,
}) {
  //input Controls
  const [selectedName, setSelectedName] = useState("");
  const [disabledName, setDisabledName] = useState(false);
  const [selectedField, setSelectedField] = useState("");
  const [selectedValue, setSelectedValue] = useState("");

  //input controls

  const fieldIndex = customStoryFilter.findIndex((el) => el.field === selectedField); //finds index of selected field if already created

  const storyNames = stories.map((story) => story.name); // returns a list of the story names

  const filterCount = customStoryFilter.length - 1; //keeps track of number of fields chosen for filter

  const addFieldToFilter = (event) => {
    setCustomStoryFilter((prevState) => [...prevState, { field: "", values: [] }]); // adds new blank filter object to array
    setSelectedValue(""); // resets input
    setSelectedField(""); //resets input
    // setDisabledName(true); //if another field is being added disables ability to add new name
  };

  // adds the name straight to customStory State
  const addCustomStoryFilterName = (event) => {
    if (event.target.type === "button") {
      if (!storyNames.includes(document.getElementById("customStoryName").value)) {
        setCustomStory((prevState) => ({
          ...prevState,
          name: document.getElementById("customStoryName").value,
        }));
      }
    } else {
      if (!storyNames.includes(event.target.value)) {
        event.keyCode === 13 &&
          setCustomStory((prevState) => ({
            ...prevState,
            name: event.target.value,
          }));
      } // key code 13 === 'enter'
    }
  };

  function updateFilterArrayField(newVal) {
    let temporaryArray = customStoryFilter.slice(); // creates copy of customStoryFilter state
    if (fieldIndex === -1) {
      //-1 == field object not created so create it
      temporaryArray[filterCount].field = newVal; // chnages the selected value of the selected index to new value
      setCustomStoryFilter(temporaryArray); // sets the customSotryFilter state to the altered temporary array
    } else {
      temporaryArray[filterCount].field === "" && temporaryArray.splice(filterCount, 1); //if adding to an existing filend value list remove empty array for next field list
      setCustomStoryFilter(temporaryArray); // sets the customSotryFilter state to the altered temporary array
    }
  }

  //adds the field to custom story
  const addCustomStoryFilterField = (event) => {
    // adds selected field to state
    if (event.target.type === "button") {
      updateFilterArrayField(document.getElementById("customStoryField").value);
    } else if (event.keyCode === 13) {
      updateFilterArrayField(event.target.value);
    } // key code 13 === 'enter'
  };

  function updateFilterArrayValues(newVal) {
    let temporaryArray = customStoryFilter.slice(); // creates copy of customStoryFilter state
    temporaryArray[fieldIndex].values = newVal; // chnages the selected value of the selected index to new value
    setCustomStoryFilter(temporaryArray); // sets the customSotryFilter state to the altered temporary array
  }

  const addCustomStoryFilterValues = (event) => {
    // adds selected values to state
    if (event.target.type === "button") {
      updateFilterArrayValues(
        checkForDuplicates(document.getElementById("customStoryValues").value, customStoryFilter[fieldIndex].values) //ensures no dupicate values added
      );
    } else {
      event.keyCode === 13 &&
        updateFilterArrayValues(
          checkForDuplicates(event.target.value, customStoryFilter[fieldIndex].values) //ensures no duplicate values added
        );
    }

    // ----- Need To Add alert, if ids.length === 0 then dont make filter --------
  };

  function getCustomFilterIds() {
    // gets ids of activities in chosen filters
    const ids = customStoryFilter.map((filter) => {
      let values = filter.values[0] === "Undefined" ? [""] : filter.values;
      return values.flatMap((val) =>
        actDataRef.current.filter((act) => act[filter.field] === val).map((act) => act[actFields.ID])
      );
    });

    const intersect = ids.reduce((a, b) => a.filter((c) => b.includes(c))); //compares each ellement in each array and returns the matching ids (ids that eet the filter)

    return intersect;
  }

  useEffect(() => {
    // every time customStoryFilter state chnages, update the custom story state
    setCustomStory((prevState) => ({ ...prevState, ids: [...new Set(getCustomFilterIds())] }));
  }, [customStoryFilter]);

  //adds customStory state to stories state adds the new story to local storage
  const addCustomStoryToList = (event) => {
    setCustomStoryDisplay(false); //hides the current story options
    setSelectedValue(""); // reset input
    setSelectedField(""); // reset input
    setSelectedName(""); // reset input
    setDisabledName(false); // allow name input
    setStories((prevState) => [...prevState, customStory]); //adds the new story to the list of stories
    if (localStories === null) {
      // adds new story to local storage
      window.localStorage.setItem("customStory", JSON.stringify([customStory]));
    } else {
      window.localStorage.setItem("customStory", JSON.stringify([...localStories, customStory]));
    }
    setCustomStory({ name: "", ids: [], custom: true }); // resets the custom story to empty
    setCustomStoryFilter([{ field: "", values: [] }]); // restes filter state to empty
  };

  const fieldFilters = [
    actFields.ID,
    actFields.RESEARCHER,
    actFields.COMPLETIONSTATUS,
    actFields.WP,
    actFields.CATEGORY,
    actFields.METHODCATEGORY,
    actFields.DISCIPLINE,
    actFields.DATAMETHOD,
    actFields.WATERPRODUCERS,
    actFields.RESEARCH,
    actFields.WATERUSERS,
    actFields.THEORY,
    actFields.PRACTICE,
    actFields.TECHPLATFORM,
    actFields.POLICYSUPPORT,
    actFields.COLLAB,
    actFields.TDPERSPECTIVE,
    actFields.ENGAGEMENTLEVEL,
  ];

  const matrixFieldOptions = fieldFilters.map((field) => (
    <option
      value={field}
      key={field}
      disabled={fieldIndex !== -1 && customStoryFilter[fieldIndex].field !== "" ? true : null}
    >
      {field}
    </option>
  ));

  //adds the options from the chosen field to a select list
  const chosenFieldOptions =
    fieldIndex !== -1 &&
    customStoryFilter[fieldIndex].field !== "" &&
    [...new Set(actDataRef.current.map((act) => act[customStoryFilter[fieldIndex].field]))].map((option, i) => (
      <option value={option === "" ? "Undefined" : option} key={i}>
        {option === "" ? "Undefined" : option}
      </option>
    ));

  const removeFilterField = (event) => {
    const hasEmptyFilter = customStoryFilter.findIndex((el) => el.field === "");
    const indexToRemove = event.target.dataset.filterindex;
    const filterClone = [...customStoryFilter];
    filterClone.splice(indexToRemove, 1);
    setCustomStoryFilter(hasEmptyFilter === -1 ? [...filterClone, { field: "", values: [] }] : filterClone);
  };

  //hides custom story options if a story is selected
  const customStoryStyle = () => {
    if (currentStory === null && customStoryDisplay === true) {
      return { display: "flex" };
    } else {
      return { display: "none" };
    }
  };

  // if the story name has been input alread then input box is red
  const customStoryNameStyle = (event) => {
    setSelectedName(event.target.value);
    if (storyNames.includes(event.target.value)) {
      event.target.style.backgroundColor = "#f40000";
    } else {
      event.target.style.backgroundColor = "white";
    }
  };

  const addStoryButtonStyle = {
    // only displays generate story button if a story has been created (with ids and a name)
    display: customStory.ids.length === 0 || customStory.name === "" ? "none" : "flex",
  };

  const noIdsSelectedButtonStyle = {
    display: customStory.ids.length === 0 && customStoryFilter[filterCount].values.length > 0 ? "flex" : "none",
  };

  const addFieldButtonStyle = {
    // only displays add field button if values have been chosen to filter ids from
    display: customStory.ids.length === 0 && customStoryFilter[filterCount].values.length === 0 ? "none" : "flex",
  };

  // generates text describing each filter in customStoryFilter state
  const filterOptionsText = customStoryFilter.map((filter, i) => (
    <div key={i} className="filterText">
      <p className="customOptions">
        Field {i > 0 && i + 1}: {filter.field}
        <span>
          {filter.field !== "" && (
            <i
              onClick={removeFilterField}
              data-filterindex={i}
              title={`remove ${filter.field} from filter`}
              className="fa fa-trash"
            ></i>
          )}{" "}
        </span>
      </p>
      <p className="customOptions">
        Values {i > 0 && i + 1}: {String(filter.values)}
      </p>
    </div>
  ));

  return (
    <div>
      <div className="customStorySection" style={customStoryStyle()}>
        <div className="customStoryInput">
          <input
            autoComplete="off"
            id="customStoryName"
            name="customStoryName"
            placeholder="story name"
            value={selectedName}
            disabled={disabledName}
            onChange={customStoryNameStyle}
            onKeyDown={addCustomStoryFilterName}
          ></input>
          <button type="button" onClick={addCustomStoryFilterName} disabled={disabledName}>
            <i className="fa-solid fa-plus"></i>
          </button>
        </div>
        <div className="customStoryInput">
          <select
            id="customStoryField"
            name="customStory"
            onKeyUp={addCustomStoryFilterField}
            onKeyDown={(e) => e.preventDefault()} //prevents 'enter' opening select dropdown
            // defaultValue=""
            value={selectedField}
            onChange={(e) => setSelectedField(e.target.value)}
          >
            <option disabled={true} value="">
              --matrix field--
            </option>
            {matrixFieldOptions}
          </select>
          <button type="button" onClick={addCustomStoryFilterField}>
            <i className="fa-solid fa-plus"></i>
          </button>
        </div>

        {customStoryFilter[filterCount].field !== "" && (
          <div className="customStoryInput">
            <select
              name="field"
              className="fieldOptionSelect"
              id="customStoryValues"
              onKeyUp={addCustomStoryFilterValues}
              onKeyDown={(e) => e.preventDefault()}
              // defaultValue=""
              value={selectedValue}
              onChange={(e) => setSelectedValue(e.target.value)}
            >
              <option disabled={true} value="">
                --field value--
              </option>
              {chosenFieldOptions}
            </select>
            <button type="button" onClick={addCustomStoryFilterValues}>
              <i className="fa-solid fa-plus"></i>
            </button>
          </div>
        )}

        <p className="customName">Name: {customStory.name !== "" && customStory.name}</p>
        {filterOptionsText}
      </div>
      <button style={addFieldButtonStyle} onClick={addFieldToFilter} className="customStoryButton">
        Add Field
      </button>
      <button onClick={addCustomStoryToList} style={addStoryButtonStyle} className="customStoryButton">
        Generate Story
      </button>
      <button style={noIdsSelectedButtonStyle}> 0 activities selected! Remove last filter?</button>
    </div>
  );
}

export default CustomStory;

//prevents 2 of the same value being chosen
function checkForDuplicates(newVal, prevVals) {
  if (prevVals.length === 0) {
    return [newVal];
  } else {
    if (prevVals.includes(newVal)) {
      return [...prevVals];
    } else {
      return [...prevVals, newVal];
    }
  }
}
