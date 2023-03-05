import { useEffect, useState } from "react";
import { Edge, useEdgesState, useNodesState, useStore } from "reactflow";
import { Layout } from "../utils/calcGraphLayout";
import {
  createNodesAndEdgesFromQuestionnaire,
  NodeData,
} from "../utils/createNodesAndEdgesFromQuestionnaire";
import { Questionnaire } from "fhir/r4";

export default function useGraph(
  questionnaire: Questionnaire,
  activeItemId: string
) {
  const [nodes, setNodes] = useNodesState<NodeData>([]);
  const [edges, setEdges] = useEdgesState<Edge>([]);
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

  function highlightEdges(edgesToHighlight: Edge[]) {
    setEdges((prevEdges) =>
      prevEdges.map((edge) => {
        if (edgesToHighlight.includes(edge)) {
          return { ...edge, selected: true };
        }
        return edge;
      })
    );
  }

  function unhighlightEdges(edgesToUnhighlight: Edge[]) {
    setEdges((prevEdges) =>
      prevEdges.map((edge) => {
        if (edgesToUnhighlight.includes(edge)) {
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
