import { useEffect, useState } from "react";
import { Edge, useEdgesState, useNodesState, useStore } from "reactflow";
import { Layout } from "../utils/calcGraphLayout";
import {
  createNodesAndEdgesForItems,
  NodeData,
} from "../utils/createNodesAndEdgesForItems";
import { QuestionnaireItem } from "fhir/r4";

export default function useGraph(
  rootItemLinkId: string,
  items: QuestionnaireItem[]
) {
  const [nodes, setNodes] = useNodesState<NodeData>([]);
  const [edges, setEdges] = useEdgesState<Edge>([]);
  const [isLayouted, setIsLayouted] = useState(false);

  useEffect(() => {
    setIsLayouted(false);
    const [newNodes, newEdges] = createNodesAndEdgesForItems(
      rootItemLinkId,
      items
    );
    setNodes(newNodes);
    setEdges(newEdges);
  }, [rootItemLinkId]);

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
