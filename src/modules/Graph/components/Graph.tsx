import { useEffect, useRef } from "react";
import ReactFlow, {
  ConnectionLineType,
  useNodes,
  useEdges,
  useNodesInitialized,
  ReactFlowInstance,
  MiniMap,
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
  const { nodes, edges, setLayout, isLayouted } = useGraph(
    questionnaire,
    activeItemId
  );

  const reactFlowInstanceRef = useRef<ReactFlowInstance | null>(null);

  function resetViewPort() {
    if (reactFlowInstanceRef.current !== null) {
      reactFlowInstanceRef.current.setViewport({ x: 0, y: 0, zoom: 1 });
    }
  }

  return (
    <div className={`h-full w-full bg-slate-50`}>
      <ReactFlow
        className={`${isLayouted ? "opacity-100" : "opacity-0"}`} // prevent flickering when layouting
        onInit={(reactFlowInstance) => {
          reactFlowInstanceRef.current = reactFlowInstance;
        }}
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView={false}
        nodesDraggable={false}
        nodesConnectable={false}
        edgesFocusable={false}
        maxZoom={1.5}
      >
        <Layouter
          onLayout={(newLayout) => {
            setLayout(newLayout);
            resetViewPort();
          }}
        />
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
