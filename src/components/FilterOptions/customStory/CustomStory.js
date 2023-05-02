import { useEffect, useState } from "react";

import { actFields } from "../../../data";

import "./CustomStory.css";
import getTypeOptionsArray from "../../../AppFunctions/getTypeOptionsArray";

export function CustomStory({
  stories,
  currentStory,
  customStoryDisplay,
  setCustomStory,
  actDataRef,
  customFilter,
  setCustomFilter,
  setStories,
  customStory,
  setCustomStoryDisplay,
  localStories,
}) {
  //------------------------------INPUT ELEMENT CONTROL STATES------------------------//
  const [selectedName, setSelectedName] = useState("");
  const [selectedField, setSelectedField] = useState("");
  const [selectedValue, setSelectedValue] = useState("");

  const [confirmedFilterField, setConfirmendFilterField] = useState(null);

  const selectedFieldIndex = customFilter.findIndex((el) => el.field === selectedField); //finds index of selected field if already created

  const storyNames = stories.map((story) => story.name); // returns a list of the story names

  const fieldCount = customFilter.length - 1; //keeps track of number of fields chosen for filter

  //-----------------------------ADDING OPTIONS TO SELECT LIST-------------------------------//
  // returns select list of user specified categorical meta_fields to filter data by // if none provide returnes empty
  var matrixFieldOptions = getTypeOptionsArray(actFields.META_FIELDS, "categorical").map((field) =>
    makeOption(field, selectedFieldIndex, customFilter, confirmedFilterField)
  );

  // pushes ID and WP options to custom story list
  matrixFieldOptions.push(
    makeOption(actFields.ID, selectedFieldIndex, customFilter, confirmedFilterField),
    makeOption(actFields.WP, selectedFieldIndex, customFilter, confirmedFilterField)
  );

  //adds the options from the chosen field to a select list
  const chosenFieldOptions =
    selectedFieldIndex !== -1 &&
    customFilter[selectedFieldIndex].field !== "" &&
    [...new Set(actDataRef.current.map((act) => act[customFilter[selectedFieldIndex].field]))].map((option, i) => (
      <option value={option === "" ? "Undefined" : option} key={i}>
        {option === "" ? "Undefined" : option}
      </option>
    ));

  //----------------------------------------------ADDING FILTER TO STATE----------------------------------------//
  //-----INITIALIZING NEW FILTER STATE-----
  const addBlankFieldToFilter = (event) => {
    setCustomFilter((prevState) => [...prevState, { field: "", values: [] }]); // adds new blank filter object to array
    setSelectedValue(""); // resets input
    setSelectedField(""); //resets input
    setConfirmendFilterField(null);
  };
  //---------STORY NAME------------
  // if the chosen name does not exist in state then adds the name  to customStory State
  const addFilterNameEnter = (event) => {
    if (event.keyCode === 13) {
      !storyNames.includes(event.target.value) &&
        setCustomStory((prevState) => ({
          ...prevState,
          name: event.target.value,
        }));
    }
  };

  const addFilterNameButton = (event) => {
    // if the chosen name does not already exist in state then add it to customStory State
    if (!storyNames.includes(document.getElementById("customStoryName").value)) {
      setCustomStory((prevState) => ({
        ...prevState,
        name: document.getElementById("customStoryName").value,
      }));
    }
  };

  //----------STORY FIELD-----------------------------
  // creates a field object in filter to be populated with values {filed: [values]}
  function updateField(newVal) {
    let temporaryArray = customFilter.slice(); // creates copy of customFilter state
    if (selectedFieldIndex === -1) {
      //-1 == field object not present so adds the selected field to most recent filter object
      temporaryArray[fieldCount].field = newVal;
      setCustomFilter(temporaryArray);
    } else {
      //if adding to an existing field then remove the empty field object from filter list and add to correct filter object
      temporaryArray[fieldCount].field === "" && temporaryArray.splice(fieldCount, 1);
      setCustomFilter(temporaryArray);
    }
  }

  //adds the field to customFilter
  const addFieldEnter = (event) => {
    if (event.keyCode === 13) {
      setConfirmendFilterField(event.target.value);
      updateField(event.target.value);
    } // key code 13 === 'enter'
  };
  //adds the field to customFilter
  const addFieldButton = (event) => {
    setConfirmendFilterField(document.getElementById("customStoryField").value);
    updateField(document.getElementById("customStoryField").value);
  };

  //---------FIELD VALUES--------
  function updateValues(newVal) {
    let temporaryArray = customFilter.slice(); // creates copy of customFilter state
    temporaryArray[selectedFieldIndex].values = newVal; //update values of chosen field index
    setCustomFilter(temporaryArray);
  }

  const addValuesEnter = (event) => {
    const valueArray = customFilter[selectedFieldIndex].values; //current values in filter
    event.keyCode === 13 && updateValues(checkForDuplicates(event.target.value, valueArray));
  };

  function addValuesButton() {
    const valueArray = customFilter[selectedFieldIndex].values; //current values in filter
    updateValues(checkForDuplicates(document.getElementById("customStoryValues").value, valueArray));
  }

  //-------------------FILTERING NODES------
  // gets ids of activities that fall within chosen filters
  function getFilterIds() {
    const ids = customFilter.map((filter) => {
      let values = filter.values[0] === "Undefined" ? [""] : filter.values; // text == undefined but dataset = ""
      return values.flatMap((val) =>
        //filtering the actData directly, beofre it is parsed in to nodes
        actDataRef.current.filter((act) => act[filter.field] === val).map((act) => act[actFields.ID])
      );
    });

    const intersect = ids.reduce((a, b) => a.filter((c) => b.includes(c))); //compares each ellement in each array and returns the matching ids (ids that eet the filter)

    return intersect;
  }

  useEffect(() => {
    // every time customStoryFilter state chnages, update the custom story state
    setCustomStory((prevState) => ({ ...prevState, ids: [...new Set(getFilterIds())], filter: [...customFilter] }));
  }, [customFilter]);

  // ------------------------------------CUSTOM STORY IN STORY LIST--------------------------------------------------//
  //adds customStory state to stories state adds the new story to local storage
  const addStoryToList = (event) => {
    setCustomStoryDisplay(false); //hides the custom story options
    setSelectedValue(""); // reset input
    setSelectedField(""); // reset input
    setSelectedName(""); // reset input
    setConfirmendFilterField(null);
    setStories((prevState) => [...prevState, customStory]); //adds the new story to the list of stories
    if (localStories === null) {
      // adds new story to local storage
      window.localStorage.setItem("customStory", JSON.stringify([customStory]));
    } else {
      window.localStorage.setItem("customStory", JSON.stringify([...localStories, customStory]));
    }
    setCustomStory({ name: "", ids: [], custom: true }); // resets the custom story to empty
    setCustomFilter([{ field: "", values: [] }]); // restes filter state to empty
  };

  const removeFilterField = (event) => {
    const hasEmptyFilter = customFilter.findIndex((el) => el.field === "");
    const indexToRemove = event.target.dataset.filterindex;
    const filterClone = [...customFilter];
    filterClone.splice(indexToRemove, 1);
    setCustomFilter(hasEmptyFilter === -1 ? [...filterClone, { field: "", values: [] }] : filterClone);
    setConfirmendFilterField(null);
  };

  // generates text describing each filter in customStoryFilter state
  const filterOptionsText = customFilter.map((filter, i) => (
    <div key={i} className="filterText">
      <p className="customOptions">
        {i + 1}. {filter.field !== "" && filter.field + ":"}
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
      <p className="customOptions valuesText">{String(filter.values).split(",").join(", ")}</p>
    </div>
  ));

  //------------------------------STYLE----------------------------------------------------------
  //hides custom story options if a story is selected
  const customStoryStyle = () => {
    if (currentStory === null && customStoryDisplay === true) {
      return { display: "flex" };
    } else {
      return { display: "none" };
    }
  };

  // if a story of the same name exists in local storage then input box is red (and name cant be selected)
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
    //displays when the selected filter removes all node IDs
    display: customStory.ids.length === 0 && customFilter[fieldCount].values.length > 0 ? "flex" : "none",
  };

  const addFieldButtonStyle = {
    // only displays add field button if values have been chosen to filter ids from
    display: customStory.ids.length === 0 ? "none" : "flex",
  };

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
            onChange={customStoryNameStyle}
            onKeyDown={addFilterNameEnter}
          ></input>
          <button type="button" data-value={selectedName} onClick={addFilterNameButton}>
            <i className="fa-solid fa-plus"></i>
          </button>
        </div>
        <div className="customStoryInput">
          <select
            id="customStoryField"
            name="customStory"
            onKeyUp={addFieldEnter}
            onKeyDown={(e) => e.preventDefault()} //prevents 'enter' opening select dropdown
            // defaultValue=""
            value={selectedField}
            onChange={(e) => setSelectedField(e.target.value)}
          >
            <option disabled={true} value="">
              --dataset field--
            </option>
            {matrixFieldOptions}
          </select>
          <button type="button" onClick={addFieldButton}>
            <i className="fa-solid fa-plus"></i>
          </button>
        </div>

        {customFilter[fieldCount].field !== "" && (
          <div className="customStoryInput">
            <select
              name="field"
              className="fieldOptionSelect"
              id="customStoryValues"
              onKeyUp={addValuesEnter}
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
            <button type="button" onClick={addValuesButton}>
              <i className="fa-solid fa-plus"></i>
            </button>
          </div>
        )}

        <p className="customName">Story name: {customStory.name !== "" && customStory.name}</p>
        {filterOptionsText}
      </div>
      <button style={addFieldButtonStyle} onClick={addBlankFieldToFilter} className="customStoryButton">
        Add Field
      </button>
      <button onClick={addStoryToList} style={addStoryButtonStyle} className="customStoryButton">
        Generate Story
      </button>
      <button onClick={removeFilterField} style={noIdsSelectedButtonStyle} data-filterindex={fieldCount}>
        0 activities selected! Remove last filter?
      </button>
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

function makeOption(field, selectedFieldIndex, customFilter, confirmedFilterField) {
  return (
    <option
      value={field}
      key={field}
      disabled={
        selectedFieldIndex !== -1 && customFilter[selectedFieldIndex].field === confirmedFilterField ? true : null
      }
    >
      {field}
    </option>
  );
}
