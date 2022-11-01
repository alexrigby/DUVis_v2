import React from "react";
import "./SidePannel.css";

import ActivityMetaSection from "./ActivityMetaSection";
import WpNodeMetaSection from "./WpNodeMetaSection";

export function SidePannel({ selectedNode, cyState, setSelectedNode, datesRef, prPeriod }) {
  //if clicked node is "" display nothing
  const style = {
    opacity: selectedNode.id === "" ? "0" : "1",
  };

  if (selectedNode.id !== "") {
    return (
      <div className="sideBar" style={style}>
        {selectedNode.type === "activityNode" ? (
          <ActivityMetaSection
            selectedNode={selectedNode}
            cyState={cyState}
            setSelectedNode={setSelectedNode}
            datesRef={datesRef}
            prPeriod={prPeriod}
          />
        ) : selectedNode.type === "wp" ? (
          <WpNodeMetaSection selectedNode={selectedNode} cyState={cyState} setSelectedNode={setSelectedNode} />
        ) : (
          <div></div>
        )}
      </div>
    );
  }
}

export default SidePannel;
