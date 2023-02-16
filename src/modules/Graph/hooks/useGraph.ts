import { QuestionnaireItem } from "fhir/r4";
import { useEffect, useState } from "react";
import { FHIRQuestionnaire } from "../../../fhir-questionnaire/FHIRQuestionnaire";
import { Edge, useEdgesState, useNodesState } from "reactflow";
import { Layout } from "../utils/calcGraphLayout";
import { NodeData } from "../components/DefaultNode";
import { createNodesFromQuestionnaire } from "../utils/createNodesFromQuestionnaire";
import { createEdgesFromQuestionnaire } from "../utils/createEdgesFromQuestionnaire";

export default function useGraph(
  questionnaire: FHIRQuestionnaire,
  activeItemId: string
) {
  const [nodes, setNodes] = useNodesState<NodeData>(
    createNodesFromQuestionnaire(questionnaire, activeItemId)
  );
  const [edges, setEdges] = useEdgesState<Edge>(
    createEdgesFromQuestionnaire(questionnaire, activeItemId)
  );
  const [isLayouted, setIsLayouted] = useState(false);

  useEffect(() => {
    setIsLayouted(false);
    setNodes(createNodesFromQuestionnaire(questionnaire, activeItemId));
    setEdges(createEdgesFromQuestionnaire(questionnaire, activeItemId));
  }, [activeItemId, questionnaire]);

  function setLayout(layout: Layout) {
    setNodes(layout.layoutedNodes);
    setEdges(layout.layoutedEdges);
    setIsLayouted(true);
  }

  return {
    nodes,
    edges,
    setLayout,
    isLayouted,
  };
}
