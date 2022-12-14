import React from "react";
import "./SidePannel.css";

import ActivityMetaSection from "./ActivityMetaSection";
import WpNodeMetaSection from "./WpNodeMetaSection";
import StakeholderMetaPannel from "./StakeholderMetaPannel";

export function SidePannel({
  selectedNode,
  cyState,
  setSelectedNode,
  datesRef,
  prPeriod,
  networkVeiw,
  setStakeholdersDisplay,
}) {
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
            networkVeiw={networkVeiw}
            setStakeholdersDisplay={setStakeholdersDisplay}
          />
        ) : selectedNode.type === "wp" ? (
          <WpNodeMetaSection
            selectedNode={selectedNode}
            cyState={cyState}
            setSelectedNode={setSelectedNode}
            setStakeholdersDisplay={setStakeholdersDisplay}
          />
        ) : (
          <StakeholderMetaPannel
            selectedNode={selectedNode}
            setSelectedNode={setSelectedNode}
            cyState={cyState}
            setStakeholdersDisplay={setStakeholdersDisplay}
          />
        )}
      </div>
    );
  }
}

export default SidePannel;
