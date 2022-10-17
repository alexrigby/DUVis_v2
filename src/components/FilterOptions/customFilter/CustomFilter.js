import { useState } from "react";
import "./CustomFilter.css";
export function CustomFilter({ actDataRef }) {
  const [customFilterDisplay, setCustomFilterDisplay] = useState(false);
  const [selectedMatrixField, setSelectedMatrixField] = useState(null);
  const [customFilterList, setCustomFilterList] = useState([]);
  const [customFilter, setCustomFilter] = useState({ name: "", field: "", values: [] });

  const customFilterStyle = {
    display: customFilterDisplay ? "flex" : "none",
  };

  const addFilterButtonStyle = {
    display:
      customFilter.values.length === 0 || customFilter.name === "" || customFilter.field === "" ? "none" : "flex",
  };

  const matrixFieldChangeHandler = (event) => {
    setSelectedMatrixField(event.target.value);
  };

  const displayCustomFilterOptions = (event) => {
    setCustomFilterDisplay((prevState) => !prevState);
  };

  const addCustomFilterName = (event) => {
    if (event.target.type === "button") {
      // if (!storyNames.includes(document.getElementById("customName").value)) {
      setCustomFilter((prevState) => ({ ...prevState, name: document.getElementById("customFilterName").value }));
      // }
    } else {
      // if (!storyNames.includes(event.target.value)) {
      event.keyCode === 13 && setCustomFilter((prevState) => ({ ...prevState, name: event.target.value }));
      // } // key code 13 === 'enter'
    }
  };

  const addCustomFilterField = (event) => {
    if (event.target.type === "button") {
      // if (!storyNames.includes(document.getElementById("customName").value)) {
      setCustomFilter((prevState) => ({ ...prevState, field: document.getElementById("customFilterField").value }));
      // }
    } else {
      // if (!storyNames.includes(event.target.value)) {
      event.keyCode === 13 && setCustomFilter((prevState) => ({ ...prevState, field: event.target.value }));
      // } // key code 13 === 'enter'
    }
  };

  const addCustomFilterValues = (event) => {
    if (event.target.type === "button") {
      setCustomFilter((prevState) => ({
        ...prevState,
        values: checkForDuplicateIds(document.getElementById("customFieldValues").value, prevState.values),
      }));
    } else {
      event.keyCode === 13 &&
        setCustomFilter((prevState) => ({
          ...prevState,
          values: checkForDuplicateIds(event.target.value, prevState.values),
        }));
    }
  };

  const addCustomFilterToList = (event) => {
    if (customFilterList.length === 0) {
      setCustomFilterList([customFilter]);
    } else {
      setCustomFilterList((prevState) => [...prevState, customFilter]);
    }
    setCustomFilter({ name: "", field: "", values: [] });
  };
  //   console.log(customFilter);
  console.log(customFilterList);
  //adds all matrix fields to the select list
  const matrixFieldOptions =
    actDataRef.current !== null &&
    Object.keys(actDataRef.current[0]).map((field) => (
      <option value={field} key={field}>
        {field}
      </option>
    ));

  //adds options of selected field to the select list
  const chosenFieldOptions =
    selectedMatrixField !== null &&
    [...new Set(actDataRef.current.map((act) => act[selectedMatrixField]))].map((option) => (
      <option value={option} key={option}>
        {option}
      </option>
    ));

  return (
    <div>
      <button className="filterOptionButton" onClick={displayCustomFilterOptions}>
        Custom Filter {customFilterDisplay ? <i className="fa fa-angle-up"></i> : <i className="fa fa-angle-down"> </i>}
      </button>
      <div className="customFilter" style={customFilterStyle}>
        <input
          autoComplete="off"
          id="customFilterName"
          name="customFilterName"
          placeholder="filter name"
          onKeyUp={addCustomFilterName}
        ></input>
        <div>
          <select
            name="field"
            className="fieldSelect"
            id="customFilterField"
            onKeyUp={addCustomFilterField}
            onChange={matrixFieldChangeHandler}
            onKeyDown={(e) => e.preventDefault()} //prevents 'enter' opening select dropdown
          >
            {matrixFieldOptions}
          </select>
        </div>
        <div>
          {selectedMatrixField !== null && (
            <select
              name="field"
              className="fieldOptionSelect"
              id="customFieldValues"
              onKeyUp={addCustomFilterValues}
              onKeyDown={(e) => e.preventDefault()}
            >
              {chosenFieldOptions}
            </select>
          )}
        </div>
        <div>
          <p className="customName">Name: {customFilter.name !== "" && customFilter.name} </p>
          <p className="customOptions">Field: {customFilter.field !== "" && customFilter.field} </p>
          <p className="customOptions"> Values: {customFilter.values.length !== 0 && String(customFilter.values)}</p>
        </div>
        <button style={addFilterButtonStyle} onClick={addCustomFilterToList} className="customStoryButton">
          Add
        </button>
      </div>
    </div>
  );
}

export default CustomFilter;

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
