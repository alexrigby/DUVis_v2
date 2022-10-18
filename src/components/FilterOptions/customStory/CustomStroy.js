import { useEffect, useState } from "react";
import { actFields } from "../../../data";

export function CustomStory({
  stories,
  currentStory,
  customStoryDisplay,
  customStory,
  setCustomStory,
  cyState,
  actDataRef,
}) {
  const [customStoryFilter, setCustomStoryFilter] = useState({ name: "", field: "", values: [] });

  const storyNames = stories.map((story) => story.name);

  const customStoryStyle = () => {
    if (currentStory === null && customStoryDisplay === true) {
      return { display: "flex" };
    } else {
      return { display: "none" };
    }
  };

  // if the story name has been input alread then input box is red
  const customStoryNameStyle = (event) => {
    if (storyNames.includes(event.target.value)) {
      event.target.style.backgroundColor = "#f40000";
    } else {
      event.target.style.backgroundColor = "white";
    }
  };

  const addCustomStoryFilterName = (event) => {
    if (event.target.type === "button") {
      if (!storyNames.includes(document.getElementById("customName").value)) {
        setCustomStoryFilter((prevState) => ({
          ...prevState,
          name: document.getElementById("customFilterName").value,
        }));
      }
    } else {
      if (!storyNames.includes(event.target.value)) {
        event.keyCode === 13 && setCustomStoryFilter((prevState) => ({ ...prevState, name: event.target.value }));
      } // key code 13 === 'enter'
    }
  };

  const addCustomStoryFilterField = (event) => {
    if (event.target.type === "button") {
      if (!storyNames.includes(document.getElementById("customName").value)) {
        setCustomStoryFilter((prevState) => ({
          ...prevState,
          field: document.getElementById("customStoryField").value,
        }));
      }
    } else {
      if (!storyNames.includes(event.target.value)) {
        event.keyCode === 13 && setCustomStoryFilter((prevState) => ({ ...prevState, field: event.target.value }));
      } // key code 13 === 'enter'
    }
  };

  const addCustomStoryFilterValues = (event) => {
    if (event.target.type === "button") {
      setCustomStoryFilter((prevState) => ({
        ...prevState,
        values: checkForDuplicateIds(document.getElementById("customFieldValues").value, prevState.values),
      }));
    } else {
      event.keyCode === 13 &&
        setCustomStoryFilter((prevState) => ({
          ...prevState,
          values: checkForDuplicateIds(event.target.value, prevState.values),
        }));
    }
  };

  function getCustomFilterIds() {
    const values = customStoryFilter.values;
    const ids = values.flatMap((val) =>
      actDataRef.current.filter((act) => act[customStoryFilter.field] === val).map((act) => act[actFields.ID])
    );
    return { name: customStoryFilter.name, ids: ids };
  }

  useEffect(() => {
    setCustomStory({ ...getCustomFilterIds(), custom: true });
  }, [customStoryFilter]);

  //adds all matrix fields to the select list
  const matrixFieldOptions =
    actDataRef.current !== null &&
    Object.keys(actDataRef.current[0]).map((field) => (
      <option value={field} key={field}>
        {field}
      </option>
    ));

  const chosenFieldOptions =
    customStoryFilter.field !== "" &&
    [...new Set(actDataRef.current.map((act) => act[customStoryFilter.field]))].map((option) => (
      <option value={option} key={option}>
        {option}
      </option>
    ));

  //   console.log(customStoryFilter);

  return (
    <div className="customStorySection" style={customStoryStyle()}>
      <div className="customStoryInput">
        <input
          autoComplete="off"
          id="customStoryName"
          name="customStoryName"
          placeholder="story name"
          onChange={customStoryNameStyle}
          onKeyUp={addCustomStoryFilterName}
        ></input>
        <button type="button" onClick={addCustomStoryFilterName}>
          <i className="fa-solid fa-plus"></i>
        </button>
      </div>
      <div className="customStoryInput">
        <select
          id="customStoryField"
          name="customStory"
          onKeyUp={addCustomStoryFilterField}
          onKeyDown={(e) => e.preventDefault()} //prevents 'enter' opening select dropdown
        >
          {matrixFieldOptions}
        </select>
        <button type="button" onClick={addCustomStoryFilterField}>
          <i className="fa-solid fa-plus"></i>
        </button>
      </div>

      {customStoryFilter.field !== "" && (
        <div className="customStoryInput">
          <select
            name="field"
            className="fieldOptionSelect"
            id="customFieldValues"
            onKeyUp={addCustomStoryFilterValues}
            onKeyDown={(e) => e.preventDefault()}
          >
            {chosenFieldOptions}
          </select>
          <button type="button" onClick={addCustomStoryFilterValues}>
            <i className="fa-solid fa-plus"></i>
          </button>
        </div>
      )}

      <p className="customName">Name: {customStoryFilter.name !== "" && customStoryFilter.name}</p>
      <p className="customOptions">Activities: {customStoryFilter.field !== "" && customStoryFilter.field}</p>
      <p className="customOptions">
        {" "}
        Values: {customStoryFilter.values.length !== 0 && String(customStoryFilter.values)}
      </p>
    </div>
  );
}

export default CustomStory;

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
