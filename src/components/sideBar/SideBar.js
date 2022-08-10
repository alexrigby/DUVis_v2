import React from "react";
import "./SideBar.css";

export function SideBar({ selectedNode }) {
  //if clicked node is "" display nothing
  const style = {
    opacity: selectedNode.id === "" ? "0" : "1",
  };

  return (
    <div className="sideBar" style={style}>
      <h1>{selectedNode.label}</h1>
    </div>
  );
}

export default SideBar;
