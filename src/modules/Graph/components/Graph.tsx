import { useEffect, useRef } from "react";
import ReactFlow, {
  useNodes,
  useEdges,
  useNodesInitialized,
  ReactFlowInstance,
  Controls,
  getConnectedEdges,
  Node,
} from "reactflow";
import "reactflow/dist/base.css";
import { calcNodeLayout } from "../utils/calcNodeLayout";
import { ItemNode } from "./nodes/ItemNode";
import useGraph from "../hooks/useGraph";
import AnswerOptionNode from "./nodes/AnswerOptionNode";
import ForeignItemNode from "./nodes/ForeignItemNode";
import DependecyEdge from "./edges/DependecyEdge";
import { QuestionnaireItem } from "fhir/r4";
import AnswerOptionEdge from "./edges/AnswerOptionEdge";

export interface GraphItem extends QuestionnaireItem {
  foreignGroup?: {
    text?: string;
    linkId: string;
  };
}

interface GraphProps {
  rootItemLinkId: string;
  items: GraphItem[];
  onNodeClicked?: (
    event: React.MouseEvent<Element, MouseEvent>,
    nodeData: Node
  ) => void;
}
const nodeTypes = {
  item: ItemNode,
  answerOption: AnswerOptionNode,
  foreignItem: ForeignItemNode,
};

const edgeTypes = {
  dependency: DependecyEdge,
  answerOption: AnswerOptionEdge,
};

export default function Graph({
  rootItemLinkId,
  onNodeClicked,
  items,
}: GraphProps) {
  const graph = useGraph(rootItemLinkId, items);
  const reactFlowInstanceRef = useRef<ReactFlowInstance>();

  useEffect(() => {
    resetViewport();
  }, [graph.isLayouted]);

  function resetViewport() {
    if (reactFlowInstanceRef.current !== undefined) {
      reactFlowInstanceRef.current.fitView({ maxZoom: 1 });
    }
  }

  function handleNodeMouseEnter(event: React.MouseEvent, node: Node) {
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
        onNodeClick={(event, node) =>
          onNodeClicked ? onNodeClicked(event, node) : null
        }
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        nodes={graph.nodes}
        edges={graph.edges}
        edgesFocusable={false}
        zoomOnDoubleClick={false}
        maxZoom={1.5}
        minZoom={0.5}
      >
        <Controls
          showInteractive={false}
          position="top-right"
          className="rounded bg-white"
        />
        <NodeLayouter onNodeLayout={graph.setLayout} />
      </ReactFlow>
    </div>
  );
}

function NodeLayouter({
  onNodeLayout,
}: {
  onNodeLayout: (layoutedNodes: Node[]) => void;
}) {
  const nodes = useNodes();
  const edges = useEdges();
  const nodesInitialized = useNodesInitialized();

  useEffect(() => {
    if (nodesInitialized === true) {
      calcNodeLayout([...nodes], [...edges]).then((newLayout) =>
        onNodeLayout(newLayout)
      );
    }
  }, [nodesInitialized]);

  return <></>;
}
