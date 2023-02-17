import { BG, BORDER, ENGAGEMENT, ENGRANK, EDGE } from "../../../configs/COLORS";
import activityOpacity from "../../../functions/ganttChartFucntions/activityOpacity";
import statusOpacity from "../../../configs/statusOpacity";
import wpEdgeStyle from "./wpEdgeStyle";

export function stylesheet(
  activityEdgeDisplay,
  stakeholdersDisplay,
  completedDisplay,
  latestPrPeriodRef,
  prPeriod,
  networkVeiw,
  cyState,
  selectedNode,

  engScoreVeiw,
  engagementScoresRef
) {
  const arrowShape = "vee";
  return [
    // ________NODES_______
    {
      selector: "node",
      style: {
        label: "data(label)",
        "text-wrap": "wrap",
        "text-valign": "center",
        color: "white",
        "border-width": 4,
      },
    },
    {
      selector: "node[type = 'project']",
      style: {
        "border-opacity": 0,
        "background-opacity": 0,
        events: "no",
        label: "",
      },
    },
    {
      selector: "node[type = 'activityNode']",
      style: {
        "border-width": 4,
        "background-opacity": completedDisplay
          ? (ele) => activityOpacity(ele.data().meta, latestPrPeriodRef.current, prPeriod)
          : statusOpacity.onGoing,
        "border-opacity": completedDisplay
          ? (ele) => activityOpacity(ele.data().meta, latestPrPeriodRef.current, prPeriod)
          : statusOpacity.onGoing,
        "background-color": (ele) => BG[ele.data("colorRef")],
        "border-color": (ele) => BORDER[ele.data("colorRef")],
        //width and height displayed in accepted bubble area scale 'D2 = D1 * SQRT(X2/X1)' https://infonewt.com/circles/
        //+1 gives value to nodes with no connecting edges,
        width: (ele) =>
          Math.sqrt(ele.connectedEdges().connectedNodes("[type != 'stakeholderNode']").length + 1 / 1) * 20,
        height: (ele) =>
          1 * Math.sqrt(ele.connectedEdges().connectedNodes("[type != 'stakeholderNode']").length + 1 / 1) * 20,
      },
    },
    {
      selector: "node[type = 'wp']",
      style: {
        "border-width": 0,
        label: "",
        "background-opacity": 0.3,
        "background-color": function (ele) {
          return BG[ele.id()];
        },
      },
    },
    {
      selector: "node[type = 'stakeholderNode']",
      style: {
        shape: "square",
        display: stakeholdersDisplay === false ? "element" : "none",
        "text-outline-color": "#666666",
        "text-outline-width": 2,
        color: "white",
        "border-opacity": completedDisplay
          ? (ele) => stakeholderOpacity(ele, latestPrPeriodRef, prPeriod, cyState)
          : statusOpacity.onGoing,
        "background-opacity": completedDisplay
          ? (ele) => stakeholderOpacity(ele, latestPrPeriodRef, prPeriod, cyState)
          : statusOpacity.onGoing,
        "background-color": engScoreVeiw
          ? `mapData(weight, 0, ${
              prPeriod.pr !== null
                ? engagementScoresRef.current[prPeriod.pr - 1].maxEngScore
                : engagementScoresRef.current[engagementScoresRef.current.length - 1].maxEngScore
            }, ${ENGRANK.low}, ${ENGRANK.high})`
          : BG.stakeholder,
        "border-color": BORDER.stakeholder,
        width: (ele) => 1 * Math.sqrt(ele.connectedEdges().connectedNodes().length + 1 / 1) * 20,
        // heigth:
        height: (ele) => 1 * Math.sqrt(ele.connectedEdges().connectedNodes().length + 1 / 1) * 20,
      },
    },
    // ______EDGES_________
    {
      selector: "edge",
      style: {
        width: 1.5,
        "line-color": EDGE,
        display: activityEdgeDisplay !== "act" || selectedNode.id !== "" ? "none" : "element",
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
        display: activityEdgeDisplay !== "wp" || selectedNode.id !== "" ? "none" : "element",
        width: (ele) => wpEdgeStyle(ele.data(), cyState.cy),
        "line-cap": "round",
        "line-opacity": 0.6,
      },
    },
    {
      selector: "edge[type = 'stakeholderEdge']",
      style: {
        display: "none",
        width: networkVeiw ? (ele) => ele.data().engagement : 1.5,
        "line-color": (ele) => ENGAGEMENT[ele.data("engagement") - 1],
        "source-arrow-color": (ele) => ENGAGEMENT[ele.data("engagement") - 1],
        "target-arrow-color": (ele) => ENGAGEMENT[ele.data("engagement") - 1],
      },
    },
    {
      //"1" = Activity inform Stakeholder
      selector: "edge[type = 'stakeholderEdge'][engagement = '1'][network = 'yes']",
      style: {
        "curve-style": "bezier",
        "source-arrow-shape": selectedNode.type === "activityNode" ? "none" : arrowShape,
        "target-arrow-shape": selectedNode.type === "activityNode" ? arrowShape : "none",
      },
    },
    {
      //"2" = stakeholder inform activity
      selector: "edge[type = 'stakeholderEdge'][engagement = '2'][network = 'yes']",
      style: {
        "curve-style": "bezier",
        "source-arrow-shape": selectedNode.type === "activityNode" ? arrowShape : "none",
        "target-arrow-shape": selectedNode.type === "activityNode" ? "none" : arrowShape,
      },
    },
    {
      // "3" = both inform one another
      selector: "edge[type = 'stakeholderEdge'][engagement = '3'][network = 'yes']",
      style: {
        "curve-style": "bezier",
        "source-arrow-shape": arrowShape,
        "target-arrow-shape": arrowShape,
        // "target-distance-from-node": "20px",
      },
    },

    {
      // "4" = both work together
      selector: "edge[type = 'stakeholderEdge'][engagement = '4'][network = 'yes']",
      style: {
        "curve-style": "bezier",
        "source-arrow-shape": arrowShape,
        "target-arrow-shape": arrowShape,
        // "target-distance-from-node": "20px",
      },
    },

    //______CLASSES__________
    {
      selector: ".lowConnections",
      style: {
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
    {
      selector: ".show",
      style: {
        display: "element",
      },
    },
  ];
}

export default stylesheet;

function stakeholderOpacity(ele, latestPrPeriodRef, prPeriod) {
  const connectedActs = ele.connectedEdges().connectedNodes("[type = 'activityNode']"); //collection of connected acts
  const undef = connectedActs.nodes('[meta.endPrPeriod = "onGoing"], [meta.endPrPeriod = "undefined"]');
  const onGoing = connectedActs.nodes(
    `[meta.endPrPeriod >= ${prPeriod.pr !== null ? prPeriod.pr : latestPrPeriodRef.current}]`
  );

  const onGoingLength = undef.length + onGoing.length; //get length of connected 'onGoing act nodes'

  return onGoingLength === 0 ? statusOpacity.completed : statusOpacity.onGoing; // if there are no ongoing act nodes then set as complete
}
