import { useEffect, useState } from "react";
import { FHIRQuestionnaire } from "../../../fhir-questionnaire/FHIRQuestionnaire";
import { Edge, useEdgesState, useNodesState } from "reactflow";
import { Layout } from "../utils/calcGraphLayout";
import {
  createNodesAndEdgesFromQuestionnaire,
  NodeData,
} from "../utils/createNodesAndEdgesFromQuestionnaire";

export default function useGraph(
  questionnaire: FHIRQuestionnaire,
  activeItemId: string
) {
  const [initialNodes, initialEdges] = createNodesAndEdgesFromQuestionnaire(
    questionnaire,
    activeItemId
  );
  const [nodes, setNodes] = useNodesState<NodeData>(initialNodes);
  const [edges, setEdges] = useEdgesState<Edge>(initialEdges);
  const [isLayouted, setIsLayouted] = useState(false);

  useEffect(() => {
    setIsLayouted(false);
    const [newNodes, newEdges] = createNodesAndEdgesFromQuestionnaire(
      questionnaire,
      activeItemId
    );
    setNodes(newNodes);
    setEdges(newEdges);

    createNodesAndEdgesFromQuestionnaire(questionnaire, activeItemId);
  }, [activeItemId, questionnaire]);

  function setLayout(layout: Layout) {
    setNodes(layout.layoutedNodes);
    setEdges(layout.layoutedEdges);
    setIsLayouted(true);
  }

  function highlightEdges(edgesToHightlight: Edge[]) {
    setEdges((prevEdges) =>
      prevEdges.map((edge) => {
        if (edgesToHightlight.includes(edge)) {
          return { ...edge, selected: true };
        }
        return edge;
      })
    );
  }

  function unhighlightEdges(edgesToUnhightlight: Edge[]) {
    setEdges((prevEdges) =>
      prevEdges.map((edge) => {
        if (edgesToUnhightlight.includes(edge)) {
          return { ...edge, selected: false };
        }
        return edge;
      })
    );
  }

  return {
    nodes,
    edges,
    setLayout,
    isLayouted,
    highlightEdges,
    unhighlightEdges,
  };
}
