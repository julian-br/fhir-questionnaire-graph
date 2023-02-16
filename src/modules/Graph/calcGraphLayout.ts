import { Edge, Node } from "reactflow";
import ELK from "elkjs/lib/elk.bundled.js";

const LAYOUT_OPTIONS = {
  "elk.algorithm": "layered",
  "elk.direction": "RIGHT", // direction of the graph
  "elk.layered.considerModelOrder.strategy": "NODES_AND_EDGES", // keep order of nodes
  "elk.layered.nodePlacement.bk.fixedAlignment": "BALANCED", //balance the tree, e.g root note is vertically centered
  "elk.layered.spacing.nodeNodeBetweenLayers": "300", // space between different hierachy layers
  "elk.separateConnectedComponents": "false", // don't allign nodes of the same hierachy layer horizontally
};

export interface Layout {
  layoutedNodes: Node[];
  layoutedEdges: Edge[];
}

export async function calcGraphLayout(
  nodes: Node[],
  edges: Edge[]
): Promise<Layout> {
  const elk = new ELK();
  const graphData = {
    id: "root",
    layoutOptions: LAYOUT_OPTIONS,
    children: nodes.map((node) => ({
      id: node.id,
      width: node.width!,
      height: node.height!,
    })),
    edges: edges.map((edge) => ({
      id: edge.id,
      sources: [edge.source],
      targets: [edge.target],
    })),
  };

  const elkLayout = await elk.layout(graphData);
  const elkLayoutNodes = elkLayout.children;

  if (elkLayoutNodes === undefined) {
    throw new Error("could not calculate layout.");
  }

  nodes.forEach((node, index) => {
    const elkLayoutNode = elkLayoutNodes[index];

    if (elkLayoutNode.x === undefined || elkLayoutNode.y === undefined) {
      throw new Error(
        `could not calculate postion for the node with the id ${node.id}`
      );
    }

    node.position = {
      x: elkLayoutNode.x,
      y: elkLayoutNode.y,
    };
  });

  return {
    layoutedNodes: nodes,
    layoutedEdges: edges,
  };
}
