import dagre from "dagre";
import { Edge, Node } from "reactflow";

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

export interface Layout {
  layoutedNodes: Node[];
  layoutedEdges: Edge[];
}

export function calcGraphLayout(nodes: Node[], edges: Edge[]): Layout {
  dagreGraph.setGraph({
    rankdir: "LR",
    nodesep: 20,
    ranksep: 180,
    ranker: "tight-tree",
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: node.width, height: node.height });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);

    if (!node.width || !node.height) {
      throw new Error();
    }

    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    node.position = {
      x: nodeWithPosition.x - node.width / 2,
      y: nodeWithPosition.y - node.height / 2,
    };

    return node;
  });

  return { layoutedNodes: nodes, layoutedEdges: edges };
}
