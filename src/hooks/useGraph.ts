import { Questionnaire, QuestionnaireItem } from "fhir/r4";
import { EdgeData, NodeData } from "reaflow";
import { useState, useEffect } from "react";
import { findItemInQuestionnaire } from "../utils/questionnaireUtils";

const INITIAL_CANVAS_WIDTH = 2000;
const INITIAL_CANVAS_HEIGHT = 2000;

const NODE_WIDTH = 350;

export default function useGraph(
  questionnaire: Questionnaire,
  activeItemId: string
) {
  const [nodes, setNodes] = useState<NodeData<QuestionnaireItem>[]>();
  const [edges, setEdges] = useState<EdgeData[]>();
  const [canvasSize, setCanvasSize] = useState({
    width: INITIAL_CANVAS_WIDTH,
    height: INITIAL_CANVAS_HEIGHT,
  });

  useEffect(() => {
    const activeItem = questionnaire.item!.find(
      (item) => item.linkId === activeItemId
    )!;

    setNodes(createNodesFromQuestionnaireItem(questionnaire, activeItem));
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

  function updateCanvasSize(
    newWitdh: number | undefined,
    newHeight: number | undefined
  ) {
    // an update of the canvas size is not neccesary until every node has a set height
    const everyNodeHasASetHeight = nodes?.every(
      (node) => node.height !== undefined
    );

    if (
      newWitdh !== undefined &&
      newHeight !== undefined &&
      everyNodeHasASetHeight
    ) {
      setCanvasSize({ width: newWitdh, height: newHeight });
    }
  }

  return {
    canvasSize,
    nodes,
    edges,
    updateNodeHeight,
    updateCanvasSize,
  };
}

function createEdgesFromQuestionnaireItem(item: QuestionnaireItem): EdgeData[] {
  const itemIsValidGroup = item.type === "group" && item.item !== undefined;
  if (itemIsValidGroup) {
    const nestedItems = item.item!;
    const dependendItems = nestedItems.filter(
      (question) => question.enableWhen !== undefined
    );

    return dependendItems.map((dependendItem) => {
      return {
        id: dependendItem.linkId,
        from: dependendItem.enableWhen![0].question,
        to: dependendItem.linkId,
      };
    });
  }

  return [];
}

// TODO: refactor
function createNodesFromQuestionnaireItem(
  questionnaire: Questionnaire,
  item: QuestionnaireItem
): NodeData<QuestionnaireItem>[] {
  const itemIsValidGroup = item.type === "group" && item.item !== undefined;
  if (itemIsValidGroup) {
    const nestedItems = item.item!;

    const dependendItemsDependencyLinkId = nestedItems
      .filter((nestedItem) => nestedItem.enableWhen !== undefined)
      .map((dependItem) => dependItem.enableWhen![0].question);

    const foreignDependendItemsLinkIds = dependendItemsDependencyLinkId.filter(
      (dependItemId) =>
        nestedItems.find((nestedItem) => nestedItem.linkId === dependItemId) ===
        undefined
    );

    const uiqueForeignDependendItemsLinkIds = new Set(
      foreignDependendItemsLinkIds
    );
    const foreignItems: QuestionnaireItem[] = [];
    uiqueForeignDependendItemsLinkIds.forEach((foreignDependendItemId) => {
      const item = findItemInQuestionnaire(
        questionnaire,
        foreignDependendItemId
      );

      if (item !== undefined) {
        foreignItems.push(item);
      }
    });

    const foreignItemsNodes = foreignItems.map((t, index) => ({
      id: t.linkId,
      data: t,
      width: NODE_WIDTH,
    }));

    const nestedItemsNodes = nestedItems.map((nestedItems) => ({
      id: nestedItems.linkId,
      data: nestedItems,
      width: NODE_WIDTH,
    }));

    return [...nestedItemsNodes, ...foreignItemsNodes];
  }

  return [
    {
      id: item.linkId,
      data: item,
      width: NODE_WIDTH,
    },
  ];
}
