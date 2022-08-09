import React from "react";
import "./SideBar.css";

export function SideBar(props) {
  //use the vis prop to determin opacity of sidebar
  const style = {
    opacity: props.vis ? "1" : "0",
  };

  return (
    <div className="sideBar" style={style}>
      <h1>hello</h1>
    </div>
  );
}

export default SideBar;
