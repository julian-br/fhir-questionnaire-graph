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
import { createEdges, createNodes } from "./calcFlowNodes";
import { FHIRQuestionnaire } from "../../fhir-questionnaire/FHIRQuestionnaire";

interface GraphProps {
  questionnaire: FHIRQuestionnaire;
  activeItemId: string;
}

export default function Flow({ questionnaire, activeItemId }: GraphProps) {
  const [nodes, setNodes] = useNodesState(
    createNodes(questionnaire, activeItemId)
  );
  const [edges, setEdges] = useEdgesState(
    createEdges(questionnaire, activeItemId)
  );

  useEffect(() => {
    console.log(createNodes(questionnaire, activeItemId));
    setNodes(createNodes(questionnaire, activeItemId));
    setEdges(createEdges(questionnaire, activeItemId));
  }, [activeItemId]);

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
        <NodeLayouter
          onLayout={(layoutedNodes) => setNodes(layoutedNodes as any)}
        />
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
