import { BG, BORDER, ENGAGEMENT } from "../../../configs/COLORS";
import activityOpacity from "../../../functions/activityOpacity";
import statusOpacity from "../../../configs/statusOpacity";

export function stylesheet(
  activityEdgeDisplay,
  stakeholdersDisplay,
  completedDisplay,
  latestPrPeriodRef,
  prPeriod,
  networkVeiw
) {
  return [
    {
      selector: "node[type = 'project']",
      style: {
        "border-opacity": 0,
        "background-opacity": 0,
        events: "no",
      },
    },
    {
      selector: "node[type = 'activityNode']",
      style: {
        // "font-family": "FontAwesome, sans-serif",
        label: "data(label)",
        "text-wrap": "wrap",
        "text-valign": "center",
        color: "white",
        "border-width": 4,
        // "background-opacity": "data(opacity)",
        "background-opacity": function (ele) {
          return activityOpacity(ele.data().meta, completedDisplay, latestPrPeriodRef.current, prPeriod);
        },
        "border-opacity": function (ele) {
          return activityOpacity(ele.data().meta, completedDisplay, latestPrPeriodRef.current, prPeriod);
        },
        "background-color": function (ele) {
          return nodeBackgroundColor(ele, "colorRef");
        },
        "border-color": function (ele) {
          return nodeBorderColor(ele, "colorRef");
        },
        //width and height displayed in accepted bubble area scale 'D2 = D1 * SQRT(X2/X1)' https://infonewt.com/circles/
        //+1 gives value to nodes with no connecting edges,
        width: function (ele) {
          return 1 * Math.sqrt(ele.connectedEdges().connectedNodes("[type != 'stakeholderNode']").length + 1 / 1) * 20;
        },
        height: function (ele) {
          return 1 * Math.sqrt(ele.connectedEdges().connectedNodes("[type != 'stakeholderNode']").length + 1 / 1) * 20;
        },
      },
    },
    {
      selector: "node[type = 'wp']",
      style: {
        label: "data(id)",
        "background-opacity": 0.3,
        "background-color": function (ele) {
          return nodeBackgroundColor(ele, "id");
        },
      },
    },
    {
      selector: "node[type = 'stakeholderNode']",
      style: {
        display: stakeholdersDisplay === false ? "element" : "none",
        "text-outline-color": "#666666",
        "text-outline-width": 1,
        label: "data(label)",
        "text-wrap": "wrap",
        "text-valign": "center",
        color: "white",
        "border-width": 4,
        "border-opacity": statusOpacity.onGoing,
        "background-opacity": statusOpacity.onGoing,
        "background-color": function (ele) {
          return nodeBackgroundColor(ele, "colorRef");
        },
        "border-color": function (ele) {
          return nodeBorderColor(ele, "colorRef");
        },
        width: function (ele) {
          return 1 * Math.sqrt(ele.connectedEdges().connectedNodes().length + 1 / 1) * 20;
        },
        height: function (ele) {
          return 1 * Math.sqrt(ele.connectedEdges().connectedNodes().length + 1 / 1) * 20;
        },
      },
    },
    {
      selector: "edge",
      style: {
        width: 1.5,
        "line-color": "#ffb37a",
        display: activityEdgeDisplay === false ? "none" : "element",
        "source-endpoint": "outside-to-line",
        "source-distance-from-node": "4px",
        "target-distance-from-node": "4px",
        "target-endpoint": "outside-to-line",
        "curve-style": "straight",
      },
    },
    {
      selector: "edge[type = 'wpEdge']",
      style: {
        display: activityEdgeDisplay === true ? "none" : "element",
        // label: "data(weight)",
        width: "data(weight)",
        "line-color": "mapData(weight, 0, 40, #ffcba4, #cb410b)",
        "line-cap": "round",
        "line-opacity": 0.5,
      },
    },
    {
      selector: "edge[type = 'stakeholderEdge']",
      style: {
        display: "none",

        "line-opacity": 1,
        width: networkVeiw
          ? (ele) => {
              return ele.data().engagement * 2;
            }
          : 1.5,
        "source-endpoint": "outside-to-line",
        "source-distance-from-node": "4px",
        "target-distance-from-node": "4px",
        "target-endpoint": "outside-to-line",
        "curve-style": "bezier",
        "line-color": (ele) => {
          return engagementEdgeColor(ele, "engagement");
        },
        // "target-arrow-color": "#ccc",
        // "target-arrow-shape": "triangle",
      },
    },
    {
      selector: ".lowConnections",
      style: {
        // label: "data(flag)",
        color: "red",
        "font-weight": 900,
      },
    },
    {
      selector: ".connectedEdge",
      style: {
        "line-color": "red",
        "line-opacity": "0.7",
        display: "element",
      },
    },
    // {
    //   selector: ".networkNode",
    //   style: {
    //     display: function (ele) {
    //       // return ele.data().meta.startPrPeriod > prPeriod.pr || ele.data().meta.endPrPeriod < prPeriod.pr
    //       //   ? "none"
    //       //   : "element";
    //       console.log(ele.data());
    //     },
    //   },
    // },
    {
      selector: ".networkEdge",
      style: {
        display: "element",
      },
    },
    {
      selector: ".selectedNode",
      style: {
        "border-color": "red",
        "border-opacity": 1,
        "border-width": "6px",
        display: "element",
      },
    },
    {
      selector: ".hilightedNode",
      style: {
        "border-color": "red",
        "background-color": "red",
        "border-opacity": 1,
        "border-width": "6px",
        display: "element",
      },
    },
    {
      selector: ".hide",
      style: {
        display: "none",
      },
    },
  ];
}

export default stylesheet;

function nodeBackgroundColor(ele, property) {
  if (ele.data(property) === "wp1") {
    return BG.wp1;
  } else if (ele.data(property) === "wp2") {
    return BG.wp2;
  } else if (ele.data(property) === "wp3") {
    return BG.wp3;
  } else if (ele.data(property) === "wp4") {
    return BG.wp4;
  } else if (ele.data(property) === "wp5") {
    return BG.wp5;
  } else if (ele.data(property) === "wp6") {
    return BG.wp6;
  } else if (ele.data(property) === "wp7") {
    return BG.wp7;
  } else if (ele.data(property) === "wp8") {
    return BG.wp8;
  } else {
    return BG.other;
  }
}

function nodeBorderColor(ele, property) {
  if (ele.data(property) === "wp1") {
    return BORDER.wp1;
  } else if (ele.data(property) === "wp2") {
    return BORDER.wp2;
  } else if (ele.data(property) === "wp3") {
    return BORDER.wp3;
  } else if (ele.data(property) === "wp4") {
    return BORDER.wp4;
  } else if (ele.data(property) === "wp5") {
    return BORDER.wp5;
  } else if (ele.data(property) === "wp6") {
    return BORDER.wp6;
  } else if (ele.data(property) === "wp7") {
    return BORDER.wp7;
  } else if (ele.data(property) === "wp8") {
    return BORDER.wp8;
  } else {
    return BORDER.other;
  }
}

function engagementEdgeColor(ele, property) {
  return ele.data(property) === "1"
    ? ENGAGEMENT[0]
    : ele.data(property) === "2"
    ? ENGAGEMENT[1]
    : ele.data(property) === "3"
    ? ENGAGEMENT[2]
    : ele.data(property) === "4"
    ? ENGAGEMENT[3]
    : BORDER.other;
}
