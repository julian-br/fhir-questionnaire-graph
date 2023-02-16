import { useEffect } from "react";
import ReactFlow, {
  ConnectionLineType,
  useNodesState,
  useEdgesState,
  useNodes,
  useEdges,
  useNodesInitialized,
} from "reactflow";
import "reactflow/dist/style.css";

import { initialNodes, initialEdges } from "./nodes-edges";
import { calcGraphLayout } from "./calcGraphLayout";

export default function Flow() {
  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges] = useEdgesState(initialEdges);

  return (
    <div className="relative h-full flex-grow">
      <ReactFlow
        className="bg-slate-100"
        nodes={nodes}
        edges={edges}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView={false}
        nodesDraggable={false}
        nodesConnectable={false}
        edgesFocusable={false}
      >
        <NodeLayouter onLayout={(layoutedNodes) => setNodes(layoutedNodes)} />
      </ReactFlow>
    </div>
  );
}

function NodeLayouter({
  onLayout,
}: {
  onLayout: (layoutedNodes: Node[]) => void;
}) {
  const nodes = useNodes();
  const edges = useEdges();
  const nodesInitialized = useNodesInitialized();

  useEffect(() => {
    if (nodesInitialized === true) {
      console.log("...layouting");
      onLayout(calcGraphLayout(nodes, edges).nodes);
    }
  }, [nodesInitialized]);

  return <></>;
}
