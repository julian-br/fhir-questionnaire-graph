import { QuestionnaireItem } from "fhir/r4";
import { EdgeData, NodeData } from "reaflow";
import { useState, useEffect } from "react";
import { FHIRQuestionnaire } from "../fhir-questionnaire/FHIRQuestionnaire";

const INITIAL_CANVAS_WIDTH = 2000;
const INITIAL_CANVAS_HEIGHT = 2000;

const NODE_WIDTH = 350;

export default function useGraph(
  questionnaire: FHIRQuestionnaire,
  activeItemId: string
) {
  const [nodes, setNodes] = useState<NodeData<QuestionnaireItem>[]>();
  const [edges, setEdges] = useState<EdgeData[]>();
  const [canvasSize, setCanvasSize] = useState({
    width: INITIAL_CANVAS_WIDTH,
    height: INITIAL_CANVAS_HEIGHT,
  });

  useEffect(() => {
    const activeItem = questionnaire.getItemByLinkId(activeItemId);

    if (activeItem !== undefined) {
      setNodes(createNodesFromQuestionnaireItem(questionnaire, activeItem));
      setEdges(createEdgesFromQuestionnaireItem(activeItem));
    }
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
  questionnaire: FHIRQuestionnaire,
  item: QuestionnaireItem
): NodeData<QuestionnaireItem>[] {
  const itemIsValidGroup = item.type === "group" && item.item !== undefined;
  if (itemIsValidGroup) {
    const nestedItems = questionnaire.getItemsOfGroupItem(item.linkId)!;
    const foreignItems = questionnaire.getForeignDependendItemsOfGroup(
      item.linkId
    );

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
