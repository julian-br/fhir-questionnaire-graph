import { useEffect } from "react";
import ReactFlow, {
  ConnectionLineType,
  useNodes,
  useEdges,
  useNodesInitialized,
} from "reactflow";
import "reactflow/dist/style.css";
import { calcGraphLayout, Layout } from "../calcGraphLayout";
import { FHIRQuestionnaire } from "../../../fhir-questionnaire/FHIRQuestionnaire";
import { CustomNode } from "./CustomNode";
import useGraph from "../hooks/useGraph";

interface GraphProps {
  questionnaire: FHIRQuestionnaire;
  activeItemId: string;
}
const nodeTypes = { custom: CustomNode };

export default function Graph({ questionnaire, activeItemId }: GraphProps) {
  const { nodes, edges, setLayout } = useGraph(questionnaire, activeItemId);

  return (
    <div className="h-full w-full bg-slate-50">
      <ReactFlow
        nodeTypes={nodeTypes}
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
      calcGraphLayout([...nodes], [...edges]).then((newLayout) =>
        onLayout(newLayout)
      );
      /* onLayout(calcGraphLayout([...nodes], [...edges]));
      calcGraphLayoutElk([...nodes], [...edges]); */
    }
  }, [nodesInitialized]);

  return <></>;
}
