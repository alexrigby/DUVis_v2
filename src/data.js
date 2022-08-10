export const data = {
  nodes: [
    { data: { id: "1", label: "Node 1" } },
    { data: { id: "2", label: "Node 2" } },
    { data: { id: "3", label: "Node 3" } },
    { data: { id: "4", label: "Node 4" } },
  ],
  edges: [
    {
      data: { source: "1", target: "2", label: "Edge from Node1 to Node2" },
    },
    {
      data: { source: "2", target: "3", label: "Edge from Node2 to Node3" },
    },
    {
      data: { source: "2", target: "4", label: "Edge from Node2 to Node4" },
    },
  ],
};

export default data;
