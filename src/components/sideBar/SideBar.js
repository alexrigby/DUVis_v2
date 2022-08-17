import React from "react";
import "./SideBar.css";

import ActivityMetaSection from "./ActivityMetaSection";
import WpNodeMetaSection from "./WpNodeMetaSection";

export function SideBar({ selectedNode, cyState, setSelectedNode }) {
  //if clicked node is "" display nothing
  const style = {
    opacity: selectedNode.id === "" ? "0" : "1",
  };

  if (selectedNode.id !== "") {
    return (
      <div className="sideBar" style={style}>
        {selectedNode.type === "activityNode" ? (
          <ActivityMetaSection selectedNode={selectedNode} cyState={cyState} setSelectedNode={setSelectedNode} />
        ) : (
          <WpNodeMetaSection selectedNode={selectedNode} cyState={cyState} setSelectedNode={setSelectedNode} />
        )}
      </div>
    );
  }
}

export default SideBar;
