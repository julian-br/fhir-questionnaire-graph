import React, { useCallback, useEffect } from "react";
import ReactFlow, {
  ReactFlowProvider,
  ConnectionLineType,
  useNodesState,
  useEdgesState,
  useNodes,
  useStore,
  useReactFlow,
  Edge,
  useEdges,
  useNodesInitialized,
} from "reactflow";
import dagre from "dagre";
import "reactflow/dist/style.css";

import { initialNodes, initialEdges } from "./nodes-edges";

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (nodes, edges) => {
  dagreGraph.setGraph({ rankdir: "LR" });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 200, height: node.height });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = "left";
    node.sourcePosition = "right";

    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    node.position = {
      x: nodeWithPosition.x - 200 / 2,
      y: nodeWithPosition.y - node.height / 2,
    };

    return node;
  });

  return { nodes, edges };
};

/* const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
  initialNodes,
  initialEdges
); */

const Flow = () => {
  const [nodes, setNodes, onNodesChanged] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="relative h-full flex-grow">
      <ReactFlow
        className="bg-slate-100"
        onNodesChange={onNodesChanged}
        nodes={nodes}
        edges={edges}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView={false}
      >
        <NodeLayouter onLayout={(layoutedNodes) => setNodes(layoutedNodes)} />
      </ReactFlow>
    </div>
  );
};

const NodeLayouter = ({
  onLayout,
}: {
  onLayout: (layoutedNodes: Node[]) => void;
}) => {
  const nodes = useNodes();
  const edges = useEdges();
  const nodesInitialized = useNodesInitialized();

  useEffect(() => {
    if (nodesInitialized === true) {
      console.log("...layouting");
      onLayout(getLayoutedElements(nodes, edges).nodes as Node[]);
    }
  }, [nodesInitialized]);

  return <></>;
};

export default Flow;
