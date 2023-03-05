import { useEffect, useRef } from "react";
import ReactFlow, {
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
import { ItemNode } from "./nodes/ItemNode";
import useGraph from "../hooks/useGraph";
import AnswerOptionNode from "./nodes/AnswerOptionNode";
import ForeignItemNode from "./nodes/ForeignItemNode";
import CustomEdge from "./CustomEdge";
import { Questionnaire } from "fhir/r4";

interface GraphProps {
  questionnaire: Questionnaire;
  activeItemId: string;
  onNodeClicked?: (nodeData: Node) => void;
}
const nodeTypes = {
  item: ItemNode,
  answerOption: AnswerOptionNode,
  foreignItem: ForeignItemNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

export default function Graph({
  questionnaire,
  activeItemId,
  onNodeClicked,
}: GraphProps) {
  const graph = useGraph(questionnaire, activeItemId);
  const reactFlowInstanceRef = useRef<ReactFlowInstance>();

  function resetViewport() {
    if (reactFlowInstanceRef.current !== undefined) {
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
    const connectedEdges = getConnectedEdges([node], graph.edges);
    graph.highlightEdges(connectedEdges);
  }

  function handleNodeMouseLeave(
    event: React.MouseEvent<Element, MouseEvent>,
    node: Node
  ) {
    if (node.type === "foreignItem") {
      return;
    }
    const connectedEdges = getConnectedEdges([node], graph.edges);
    graph.unhighlightEdges(connectedEdges);
  }

  return (
    <div className={`h-full w-full bg-slate-50`}>
      <ReactFlow
        className={`${graph.isLayouted ? "opacity-100" : "opacity-0"}`} // prevent flickering when layouting
        onInit={(reactFlowInstance) => {
          reactFlowInstanceRef.current = reactFlowInstance;
        }}
        onNodeMouseEnter={handleNodeMouseEnter}
        onNodeMouseLeave={handleNodeMouseLeave}
        onNodeClick={(_, node) => (onNodeClicked ? onNodeClicked(node) : null)}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        nodes={graph.nodes}
        edges={graph.edges}
        edgesFocusable={false}
        zoomOnDoubleClick={false}
        maxZoom={1.5}
        minZoom={0.5}
      >
        <Background />
        <Controls
          showInteractive={false}
          position="top-right"
          className="rounded bg-white"
        />
        <Layouter
          onLayout={(newLayout) => {
            graph.setLayout(newLayout);
            resetViewport();
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
