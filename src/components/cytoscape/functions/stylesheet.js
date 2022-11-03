import COLORS from "../../../configs/wpColors";

export function stylesheet(activityEdgeDisplay) {
  return [
    {
      selector: "node[type != 'wp']",
      style: {
        // "font-family": "FontAwesome, sans-serif",
        label: "data(id)",
        "text-wrap": "wrap",
        "text-valign": "center",
        color: "white",
        "border-width": 4,
        "background-opacity": "data(opacity)",
        "border-opacity": "data(opacity)",
        "background-color": function (ele) {
          return nodeBackgroundColor(ele, "parent");
        },
        "border-color": function (ele) {
          return nodeBorderColor(ele, "parent");
        },
        //width and height displayed in accepted bubble area scale 'D2 = D1 * SQRT(X2/X1)' https://infonewt.com/circles/
        //+1 gives value to nodes with no connecting edges,
        width: function (ele) {
          return 1 * Math.sqrt((ele.connectedEdges().length + 1) / 1) * 20;
        },
        height: function (ele) {
          return 1 * Math.sqrt((ele.connectedEdges().length + 1) / 1) * 20;
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
        "text-outline-color": "#666666",
        "text-outline-width": 1,
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
      selector: "edge[type != 'activityEdge']",
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
      selector: ".show",
      style: {
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
    return COLORS.bg.wp1;
  } else if (ele.data(property) === "wp2") {
    return COLORS.bg.wp2;
  } else if (ele.data(property) === "wp3") {
    return COLORS.bg.wp3;
  } else if (ele.data(property) === "wp4") {
    return COLORS.bg.wp4;
  } else if (ele.data(property) === "wp5") {
    return COLORS.bg.wp5;
  } else if (ele.data(property) === "wp6") {
    return COLORS.bg.wp6;
  } else if (ele.data(property) === "wp7") {
    return COLORS.bg.wp7;
  } else if (ele.data(property) === "wp8") {
    return COLORS.bg.wp8;
  } else {
    return COLORS.bg.other;
  }
}

function nodeBorderColor(ele, property) {
  if (ele.data(property) === "wp1") {
    return COLORS.border.wp1;
  } else if (ele.data(property) === "wp2") {
    return COLORS.border.wp2;
  } else if (ele.data(property) === "wp3") {
    return COLORS.border.wp3;
  } else if (ele.data(property) === "wp4") {
    return COLORS.border.wp4;
  } else if (ele.data(property) === "wp5") {
    return COLORS.border.wp5;
  } else if (ele.data(property) === "wp6") {
    return COLORS.border.wp6;
  } else if (ele.data(property) === "wp7") {
    return COLORS.border.wp7;
  } else if (ele.data(property) === "wp8") {
    return COLORS.border.wp8;
  } else {
    return COLORS.border.other;
  }
}
