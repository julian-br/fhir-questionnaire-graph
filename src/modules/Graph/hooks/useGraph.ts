import { useEffect, useRef, useState } from "react";
import { Edge, Node, useEdgesState, useNodesState } from "reactflow";
import {
  createNodesAndEdgesForItems,
  NodeData,
} from "../utils/createNodesAndEdgesForItems";
import { QuestionnaireItem } from "fhir/r4";

export default function useGraph(
  activeItemId: string,
  items: QuestionnaireItem[]
) {
  const [nodes, setNodes] = useNodesState<NodeData>([]);
  const [edges, setEdges] = useEdgesState<Edge>([]);
  const [isLayouted, setIsLayouted] = useState(false);

  const prevRootItemLinkId = useRef<string | undefined>(undefined);

  useEffect(() => {
    const [newNodes, newEdges] = createNodesAndEdgesForItems(
      activeItemId,
      items
    );

    if (activeItemId !== prevRootItemLinkId.current) {
      setIsLayouted(false);
      setNodes(newNodes);
      setEdges(newEdges);
      prevRootItemLinkId.current = activeItemId;
    } else {
      // only update node data, if rootItemLinkId is the same -> prevent unecessary layout
      setNodes((prevNodes) =>
        prevNodes.map((node) => {
          const matchingNewNode = newNodes.find(
            (newNode) => newNode.id === node.id
          );

          if (matchingNewNode === undefined) {
            throw new Error("no node with a matching id in the new node data");
          }
          node.data = { ...matchingNewNode.data };
          return node;
        })
      );
    }
  }, [activeItemId, items]);

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
