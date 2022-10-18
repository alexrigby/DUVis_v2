import { useState } from "react";

export function CustomStory({ stories, currentStory, customStoryDisplay, customStory, setCustomStory, cyState }) {
  const customStoryStyle = () => {
    if (currentStory === null && customStoryDisplay === true) {
      return { display: "flex" };
    } else {
      return { display: "none" };
    }
  };

  const storyNames = stories.map((story) => story.name);

  // if the story name has been input alread then input box is red
  const customStoryNameStyle = (event) => {
    if (storyNames.includes(event.target.value)) {
      event.target.style.backgroundColor = "#f40000";
    } else {
      event.target.style.backgroundColor = "white";
    }
  };

  const addCustomStoryName = (event) => {
    if (event.target.type === "button") {
      if (!storyNames.includes(document.getElementById("customName").value)) {
        setCustomStory((prevState) => ({ ...prevState, name: document.getElementById("customName").value }));
      }
    } else {
      if (!storyNames.includes(event.target.value)) {
        event.keyCode === 13 && setCustomStory((prevState) => ({ ...prevState, name: event.target.value }));
      } // key code 13 === 'enter'
    }
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

  const sortedNodes =
    cyState.cy !== null && cyState.cy.nodes("[type = 'activityNode']").sort((a, b) => a.id() - b.id()); //sorts nodes in oredr of ID

  const idSelectOptions =
    cyState.cy !== null &&
    sortedNodes.map((node) => (
      <option value={node.id()} key={node.id()}>
        {node.id()}
      </option>
    ));

  return (
    <div className="customStorySection" style={customStoryStyle()}>
      <div className="customStoryInput">
        <input
          autoComplete="off"
          id="customName"
          name="customStory"
          placeholder="story name"
          onChange={customStoryNameStyle}
          onKeyUp={addCustomStoryName}
        ></input>
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
      <p className="customName">Name: {customStory.name !== "" && customStory.name}</p>
      <p className="customOptions">Activities: {customStory.ids.length !== 0 && String(customStory.ids)}</p>
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
