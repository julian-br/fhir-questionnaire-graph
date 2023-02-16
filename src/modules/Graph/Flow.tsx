import { useEffect, useMemo } from "react";
import ReactFlow, {
  ConnectionLineType,
  useNodes,
  useEdges,
  useNodesInitialized,
} from "reactflow";
import "reactflow/dist/style.css";
import { calcGraphLayout, Layout } from "./calcGraphLayout";
import { FHIRQuestionnaire } from "../../fhir-questionnaire/FHIRQuestionnaire";
import { CustomNode } from "./nodes/CustomNode";
import useGraph from "../../hooks/useGraph";

interface GraphProps {
  questionnaire: FHIRQuestionnaire;
  activeItemId: string;
}

export default function Flow({ questionnaire, activeItemId }: GraphProps) {
  const { nodes, edges, setLayout } = useGraph(questionnaire, activeItemId);

  const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);

  return (
    <div className="relative h-full flex-grow">
      <ReactFlow
        nodeTypes={nodeTypes}
        className="bg-slate-100"
        nodes={nodes}
        edges={edges}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView={false}
        nodesDraggable={false}
        nodesConnectable={false}
        edgesFocusable={false}
      >
        <Layouter onLayout={setLayout} />
      </ReactFlow>
    </div>
  );
}

function Layouter({ onLayout }: { onLayout: (layout: Layout) => void }) {
  const nodes = useNodes();
  const edges = useEdges();
  const nodesInitialized = useNodesInitialized();

  useEffect(() => {
    if (nodesInitialized === true) {
      console.log("...layouting");
      onLayout(calcGraphLayout(nodes, edges));
    }
  }, [nodesInitialized]);

  return <></>;
}
