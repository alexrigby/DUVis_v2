export const data = {
  nodes: [
    { data: { id: "1", label: "Node 1" }, position: { x: 0, y: 0 } },
    { data: { id: "2", label: "Node 2" }, position: { x: 100, y: 0 } },
    { data: { id: "3", label: "Node 3" }, position: { x: 100, y: 0 } },
  ],
  edges: [
    {
      data: { source: "1", target: "2", label: "Edge from Node1 to Node2" },
    },
    {
      data: { source: "2", target: "3", label: "Edge from Node2 to Node3" },
    },
  ],
};

export default data;
