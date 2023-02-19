import { useEffect, useRef } from "react";
import ReactFlow, {
  ConnectionLineType,
  useNodes,
  useEdges,
  useNodesInitialized,
  ReactFlowInstance,
  Background,
  Controls,
  getConnectedEdges,
  Node,
} from "reactflow";
import "reactflow/dist/base.css";
import { calcGraphLayout, Layout } from "../utils/calcGraphLayout";
import { FHIRQuestionnaire } from "../../../fhir-questionnaire/FHIRQuestionnaire";
import { ItemNode } from "./nodes/ItemNode";
import useGraph from "../hooks/useGraph";
import AnswerOptionNode from "./nodes/AnswerOptionNode";
import ForeignItemNode from "./nodes/ForeignItemNode";
import CustomEdge from "./CustomEdge";

interface GraphProps {
  questionnaire: FHIRQuestionnaire;
  activeItemId: string;
}
const nodeTypes = {
  item: ItemNode,
  answerOption: AnswerOptionNode,
  foreignItem: ForeignItemNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

export default function Graph({ questionnaire, activeItemId }: GraphProps) {
  const {
    nodes,
    edges,
    setLayout,
    isLayouted,
    highlightEdges,
    unhighlightEdges,
  } = useGraph(questionnaire, activeItemId);

  const reactFlowInstanceRef = useRef<ReactFlowInstance | null>(null);

  function resetViewPort() {
    if (reactFlowInstanceRef.current !== null) {
      reactFlowInstanceRef.current.setViewport({ x: 0, y: 0, zoom: 1 });
    }
  }

  function handleNodeMouseEnter(
    event: React.MouseEvent<Element, MouseEvent>,
    node: Node
  ) {
    if (node.type === "foreignItem") {
      return;
    }
    const connectedEdges = getConnectedEdges([node], edges);
    highlightEdges(connectedEdges);
  }

  function handleNodeMouseLeave(
    event: React.MouseEvent<Element, MouseEvent>,
    node: Node
  ) {
    if (node.type === "foreignItem") {
      return;
    }
    const connectedEdges = getConnectedEdges([node], edges);
    unhighlightEdges(connectedEdges);
  }

  return (
    <div className={`h-full w-full bg-slate-50`}>
      <ReactFlow
        className={`${isLayouted ? "opacity-100" : "opacity-0"}`} // prevent flickering when layouting
        onInit={(reactFlowInstance) => {
          reactFlowInstanceRef.current = reactFlowInstance;
        }}
        onNodeMouseEnter={handleNodeMouseEnter}
        onNodeMouseLeave={handleNodeMouseLeave}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        nodes={nodes}
        edges={edges}
        connectionLineType={ConnectionLineType.SmoothStep}
        nodesDraggable={false}
        nodesConnectable={false}
        edgesFocusable={false}
        maxZoom={1.5}
        minZoom={0.5}
      >
        <Background className="stroke-slate-300" />
        <Controls
          showInteractive={false}
          position="top-right"
          className="rounded bg-white"
        />
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
    }
  }, [nodesInitialized]);

  return <></>;
}
