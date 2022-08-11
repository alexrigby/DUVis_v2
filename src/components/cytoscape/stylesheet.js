export const stylesheet = [
  {
    selector: "node[type != 'wp']",
    style: {
      label: "data(id)",
      "text-valign": "center",
      color: "white",
    },
  },
  {
    selector: "node[type = 'wp']",
    style: {
      label: "data(id)",
    },
  },
  {
    selector: "edge",
    style: {
      width: 1.5,
      "line-color": "#ffcba4",
      // display: "none",
      "source-endpoint": "outside-to-line",
      "source-distance-from-node": "4px",
      "target-distance-from-node": "4px",
      "target-endpoint": "outside-to-line",
      "curve-style": "straight",
    },
  },
  {
    selector: ".connectedEdge",
    style: {
      "line-color": "red",
    },
  },
];

export default stylesheet;
