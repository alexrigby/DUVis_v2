import React, { useEffect } from "react";
import "./SideBar.css";

export function SideBar({ selectedNode }) {
  const meta = selectedNode.meta;

  //if clicked node is "" display nothing
  const style = {
    opacity: selectedNode.id === "" ? "0" : "1",
  };

  if (selectedNode.id !== "") {
    const completedStyle = {
      color: selectedNode.meta["Activity Status"] === "Completed" ? "#39ff14" : "#ffbf00",
    };

    const metaScetion = (
      <div>
        <div className="metaSection">
          <h1>
            {meta.ID}. {meta["Activity Name"]}
          </h1>
          <p style={completedStyle} className="completed">
            {meta["Activity Status"]}
          </p>
          <h2>Start-End Months:</h2>
          <p>
            {meta["Start Month"]}-{meta["End Month"]}
          </p>
          <h2> Category:</h2> <p>{meta["Activity Category"]}</p>
          <h2> End Users: </h2> <p>{meta["End Users"]}</p>
          <h2> PDCA Cycle: </h2> <p>{meta["PDCA Cycle"]}</p>
          <h2> Contribution to DU: </h2> <p>{meta["Contribution to DU"]}</p>
        </div>
        <div className="metaSection">
          <h1>DESCRIPTION: </h1> <p>{meta["Activity description"]}</p>
        </div>
        <div className="metaSection">
          <h1>RESEARCH: </h1>
          <h2>Question Type:</h2> {researchQuestionType(meta)}
          <h2>Question:</h2> <p> {meta["Research questions"]} </p>
        </div>
        <div className="metaSection">
          <h1>METHODOLOGY:</h1>
          <h2>Category:</h2> <p>{meta["Methodology category"]}</p>
          <h2>Methodology: </h2> <p>{meta["Methodology"]} </p>
        </div>
        <div className="metaSection">
          <h1>DATA: </h1>
          <h2>Procurement Method: </h2> <p>{meta["Data Procurement Method"]} </p>
          <h2>Type:</h2> <p>{meta["Data Types and Procurement"]}</p>
          <h2>Usage:</h2> <p>{meta["Data Usage"]}</p>
        </div>
        <div className="metaSection">
          <h1>DISCIPLINE: </h1>
          <h2>Category: </h2> <p>{meta["Discipline"]}</p>
          <h2>Specific Perspective:</h2> <p>{meta["Specific Disciplinary perspectives"]}</p>
          <h2>Transdisciplinary Perspectives:</h2> <p>{meta["Transdisciplinary perspectives"]}</p>
        </div>
        <div className="metaSection">
          <h1>IERLAND WATER: </h1>
          <h2>Aims and Objectives: </h2> <p>{meta["IW Aims and Objectives"]}</p>
          <h2>Contribution:</h2> <p>{meta["Contributions to IW aims and objectives"]}</p>
        </div>
      </div>
    );

    return (
      <div className="sideBar" style={style}>
        {metaScetion}
      </div>
    );
  }
}

export default SideBar;

function researchQuestionType(meta) {
  if (meta["Research Question type 2"] === "") {
    return <p>{meta["Research Question type"]}</p>;
  } else {
    return (
      <p>
        {meta["Research Question type"]} & {meta["Research Question type 2"]}
      </p>
    );
  }
}
