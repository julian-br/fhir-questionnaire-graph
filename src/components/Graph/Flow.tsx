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
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="relative h-full flex-grow">
      <ReactFlowProvider>
        <ReactFlow
          className="bg-slate-100"
          nodes={nodes}
          edges={edges}
          connectionLineType={ConnectionLineType.SmoothStep}
          fitView={true}
        ></ReactFlow>
        <NodeLayouter onLayout={(layoutedNodes) => setNodes(layoutedNodes)} />
      </ReactFlowProvider>
    </div>
  );
};

const NodeLayouter = ({
  onLayout,
}: {
  onLayout: (layoutedNodes: Node[]) => void;
}) => {
  const nodesHook = useStore((state) => state.getNodes());
  const edgesHook = useEdges();

  /* console.log("rerender", nodesHook); */
  useEffect(() => {
    const isRendered = nodesHook.every(
      (node) => node.width !== undefined && node.height !== undefined
    );
    const isLayouted = nodesHook.every(
      (node) => !isNaN(node.position.x) && !isNaN(node.position.y)
    );
    /* console.log(
      "layoutEffect",
      nodesHook,
      "rendered:",
      isRendered,
      "la:",
      isLayouted
    ); */

    if (isRendered && !isLayouted) {
      console.log("...layouting");
      onLayout(getLayoutedElements(nodesHook, edgesHook).nodes as Node[]);
    }
    /* console.log(getLayoutedElements(nodesHook, edgesHook)); */
    /* onLayout(getLayoutedElements(nodesHook, edgesHook).nodes as Node[]); */
  }, [nodesHook]);

  return <></>;
};

export default Flow;
