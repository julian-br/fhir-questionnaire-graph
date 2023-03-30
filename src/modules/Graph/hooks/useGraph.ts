import { useEffect, useRef, useState } from "react";
import { Edge, Node, useEdgesState, useNodesState } from "reactflow";
import {
  createNodesAndEdgesForItems,
  NodeData,
} from "../utils/createNodesAndEdgesForItems";
import { QuestionnaireItem } from "fhir/r4";

export default function useGraph(
  selectedItemId: string,
  items: QuestionnaireItem[]
) {
  const [nodes, setNodes] = useNodesState<NodeData>([]);
  const [edges, setEdges] = useEdgesState<Edge>([]);
  const [isLayouted, setIsLayouted] = useState(false);

  const prevRootItemLinkId = useRef<string | undefined>(undefined);

  useEffect(() => {
    const [newNodes, newEdges] = createNodesAndEdgesForItems(
      selectedItemId,
      items
    );

    if (selectedItemId !== prevRootItemLinkId.current) {
      setIsLayouted(false);
      setNodes(newNodes);
      setEdges(newEdges);
      prevRootItemLinkId.current = selectedItemId;
    } else {
      // only update node data, if rootItemLinkId is the same -> prevent unecessary layout
      setNodes((prevNodes) =>
        prevNodes.map((node, index) => {
          node.data = newNodes[index].data;
          return node;
        })
      );
    }
  }, [selectedItemId, items]);

  function setNodeLayout(layoutedNodes: Node[]) {
    setNodes(layoutedNodes);
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
    setLayout: setNodeLayout,
    isLayouted,
    highlightEdges,
    unhighlightEdges,
  };
}
