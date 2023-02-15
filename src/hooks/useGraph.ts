import { Questionnaire, QuestionnaireItem } from "fhir/r4";
import { EdgeData, NodeData } from "reaflow";
import { useState, useEffect } from "react";

export default function useGraph(
  questionnaire: Questionnaire,
  activeItemId: string
) {
  const [nodes, setNodes] = useState<NodeData<QuestionnaireItem>[]>();
  const [edges, setEdges] = useState<EdgeData[]>();

  useEffect(() => {
    const activeItem = questionnaire.item!.find(
      (item) => item.linkId === activeItemId
    )!;

    setNodes(createNodesFromQuestionnaireItem(activeItem));
    setEdges(createEdgesFromQuestionnaireItem(activeItem));
  }, [activeItemId]);

  function updateNodeHeight(nodeId: string, newHeight: number) {
    setNodes((prevNodes) =>
      prevNodes?.map((node) => {
        if (node.id === nodeId) {
          return { ...node, height: newHeight };
        }
        return node;
      })
    );
  }

  return {
    nodes,
    edges,
    updateNodeHeight,
  };
}

function createEdgesFromQuestionnaireItem(item: QuestionnaireItem) {
  if (item.type === "group" && item.item !== undefined) {
    const nestedQuestions = item.item.filter(
      (question) => question.enableWhen !== undefined
    );

    return nestedQuestions.map((nestedQuestion) => {
      return {
        id: nestedQuestion.linkId,
        from: nestedQuestion.enableWhen![0].question,
        to: nestedQuestion.linkId,
      };
    });
  }

  return [];
}

function createNodesFromQuestionnaireItem(
  item: QuestionnaireItem
): NodeData<QuestionnaireItem>[] {
  if (item.type === "group" && item.item !== undefined) {
    return item.item.map((question) => ({
      id: question.linkId,
      data: question,
      width: 350,
    }));
  }

  return [
    {
      id: item.linkId,
      data: item,
      width: 350,
    },
  ];
}
